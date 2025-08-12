import React, { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { forgotPassword, googleLogin, login, register, resetPassword, verifyOtp } from '../Redux/Slice/auth.slice';
import { useDispatch, useSelector } from 'react-redux';
import { LuEye, LuEyeClosed } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { getAllUserNames } from '../Redux/Slice/user.slice';
import google_login from '../Asset/images/google_login.svg';
import { useGoogleLogin } from '@react-oauth/google';

export default function Login({setShowLoginModal}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const inputRefs = useRef([]);
    const [email, setEmail] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [OtpError, setError] = useState("");
    const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
    const userNames = useSelector((state) => state.user.allNames);
    const [otp, setOtp] = useState(new Array(6).fill(""));

    useEffect(() => {
        dispatch(getAllUserNames())
    }, [dispatch])

    const formik = useFormik({
        initialValues: {
            userName: '',
            fullName: '',
            email: '',
            password: '',
            showPassword: false,
            resetEmail: '',
            showNewPassword: false,
            showConfirmPassword: false,
            newPassword: '',
            confirmPassword: '',
        },
        validateOnChange: false,
        validateOnBlur: false,
        validationSchema: Yup.object({
            userName: !isLogin
                ? Yup.string()
                    .required('User Name Required')
                    .matches(/^\S*$/, 'Username cannot contain spaces') // ⬅️ this line shows error
                    .test('unique-username', 'Username already taken', function (value) {
                        if (!value) return true;
                        const normalizedValue = value.toLowerCase().trim();
                        const allNames = (userNames || []).map(name => name.toLowerCase().trim());
                        return !allNames.includes(normalizedValue);
                    })
                : Yup.string(),

            fullName: !isLogin ? Yup.string().required('Full Name Required') : Yup.string(),

            email: !isLogin ? Yup.string()
                .email('Invalid email address')
                .required('Email is Required') : Yup.string().required('userName / Email Required'),

            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),

            resetEmail: forgotPasswordStep === 1 && Yup.string()
                .email('Invalid email address')
                .required('Email is required'),

            newPassword: Yup.string()
                .when([], {
                    is: () => forgotPasswordStep === 3,
                    then: (schema) => schema
                        .min(6, "Password must be at least 6 characters")
                        .required("New Password is required"),
                    otherwise: (schema) => schema.notRequired(),
                }),
            confirmPassword: Yup.string()
                .when("newPassword", {
                    is: () => forgotPasswordStep === 3,
                    then: (schema) => schema
                        .oneOf([Yup.ref("newPassword"), null], "Password and Confirm Password not match")
                        .required("Confirm Password is required"),
                    otherwise: (schema) => schema.notRequired(),
                }),
        }),
        onSubmit: async (values) => {
            if (forgotPasswordStep === 3) {
                const { newPassword, confirmPassword } = values;
                handleChangePassword({ newPassword, confirmPassword });
            } else if (forgotPasswordStep === 1) {
                // Handle forgot password submission
                setEmail(values.resetEmail);
                dispatch(forgotPassword({ email: values.resetEmail }))
                    .then((response) => {
                        if (response.payload.success) {
                            setForgotPasswordStep(2);
                            console.log("Password reset email sent.");
                        }
                    });
            } else {
                const handleResponse = (response) => {
                    console.log(response);
                    if (response.payload.success) {
                        // navigate('/');
                        setShowLoginModal(false)
                    }
                };
                if (isLogin) {
                    dispatch(login(values)).then(handleResponse);
                } else {
                    dispatch(register(values)).then(handleResponse);
                }
            }
        },
    });

    const isUserNameTaken = () => {
        const entered = formik.values.userName.toLowerCase().trim();
        return userNames.map(name => name.toLowerCase().trim()).includes(entered);
    };

    const handleVerifyOTP = () => {
        setForgotPasswordStep(3);
    };

    const handleChangePassword = (values) => {
        const { newPassword } = values;
        dispatch(resetPassword({ newPassword, email })).then((response) => {
            console.log(response);
            if (response.payload.success) {
                setForgotPasswordStep(0);
            }
        });
    };

    const onComplete = (otpValue) => { };

    const OtphandleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 6 - 1) {
            inputRefs?.current[index + 1]?.focus();
        }

        const otpValue = newOtp.join("");
        if (otpValue.length === 6) {
            onComplete?.(otpValue);
        }
    };

    const OtphandleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs?.current[index - 1]?.focus();
        }
    };

    const OtphandlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);

        if (/^\d+$/.test(pastedData)) {
            const newOtp = [...otp];
            pastedData.split("").forEach((digit, index) => {
                if (index < 6) {
                    newOtp[index] = digit;
                }
            });
            setOtp(newOtp);

            if (pastedData.length === 6) {
                onComplete?.(pastedData);
            }
            // Focus last filled input or first empty input
            const focusIndex = Math.min(pastedData.length, 6 - 1);
            inputRefs?.current[focusIndex]?.focus();
        }
    };

    const OtpSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            setError("Please enter the complete OTP.");
            return;
        }
        setError("");
        try {
            const response = await dispatch(
                verifyOtp({ email: email, otp: otpValue })
            );
            console.log(response);
            if (response.payload.success) {
                handleVerifyOTP(otpValue);
            } else {
                setError("OTP verification failed. Please try again.");
            }
        } catch (error) {
            setError("Error verifying OTP. Please try again.");
        }
    };

    const googleLogIn = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            // console.log(tokenResponse);
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                },
            });
            const userInfo = await res.json();

            // const decodedToken = jwtDecode(tokenResponse.access_token);
            const { name, email, sub, picture } = userInfo;
            const formattedUserName = name.replace(/\s+/g, '_');
            // console.log("userInfo", formattedUserName, name, email, sub, picture);

            dispatch(googleLogin({ uid: sub, userName: formattedUserName, fullName: name, email, photo: picture })).then((response) => {
                if (response.payload.success) {
                    // navigate('/')
                    setShowLoginModal(false)
                }

                if (response?.payload?.user && response?.payload?.user?.role == "admin") {
                    sessionStorage.setItem('hasRedirected', 'true');
                    setShowLoginModal(false)
                    navigate("/admin")
                }
            });
        },
    });

    return (
      
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-md bg-primary-light/10 backdrop-blur-md rounded-xl text-white p-8 shadow-primary-light/40 shadow-[0_8px_32px_0]"
            >
                {forgotPasswordStep == 0 && (
                    <>
                        <h2 className="text-3xl font-bold text-center mb-6 ">
                            {isLogin ? 'Gamer Login' : 'Create Account'}
                        </h2>

                        <form className="space-y-3" onSubmit={formik.handleSubmit}>
                            {!isLogin && (
                                <>
                                    <div className="">
                                        <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Full Name"
                                            onChange={formik.handleChange}
                                            value={formik.values.fullName}
                                            className="w-full bg-primary-dark/20 text-[14px] text-white border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        {formik.errors.fullName && formik.touched.fullName && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {formik.errors.fullName}
                                            </div>
                                        )}
                                    </div>

                                    <div className="">
                                        <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                                            User Name
                                        </label>
                                        <input
                                            type="text"
                                            name="userName"
                                            placeholder="User Name"
                                            // onChange={formik.handleChange}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                formik.setFieldValue("userName", value);
                                            }}
                                            onBlur={(e) => {
                                                const trimmed = e.target.value.trim();
                                                if (/\s/.test(trimmed)) {
                                                    formik.setFieldError('userName', 'Username cannot contain spaces');
                                                }
                                                formik.handleBlur(e);
                                            }}
                                            value={formik.values.userName}
                                            className="w-full bg-primary-dark/20 text-[14px] text-white border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        {formik.touched.userName && (
                                            <>
                                                {formik.errors.userName ? (
                                                    <div className="text-red-500 text-sm mt-1">{formik.errors.userName}</div>
                                                ) : (
                                                    formik.values.userName && (
                                                        <div className={`text-sm mt-1 ${isUserNameTaken() ? 'text-red-500' : 'text-green-400'}`}>
                                                            {isUserNameTaken() ? 'Username already taken' : 'Username available'}
                                                        </div>
                                                    )
                                                )}
                                            </>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className="">
                                <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                                    {isLogin ? "Email Or UserName" : "Email"}
                                </label>
                                <input
                                    type={isLogin ? "text" : "email"}
                                    name="email"
                                    placeholder="Email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    className="w-full bg-primary-dark/20 text-[14px] text-white border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                {formik.errors.email && formik.touched.email && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {formik.errors.email}
                                    </div>
                                )}
                            </div>

                            <div className="">
                                <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={formik.values.showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        onChange={formik.handleChange}
                                        value={formik.values.password}
                                        className="w-full bg-primary-dark/20 text-[14px] text-white border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <div
                                        className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            formik.setFieldValue(
                                                "showPassword",
                                                !formik.values.showPassword
                                            );
                                        }}
                                    >
                                        {formik.values.showPassword ? <LuEye /> : <LuEyeClosed />}
                                    </div>
                                </div>
                                {formik.errors.password && formik.touched.password && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {formik.errors.password}
                                    </div>
                                )}
                            </div>

                            <div className="text-end">
                                <button
                                    onClick={() => { setForgotPasswordStep(1); }}
                                    type="button"
                                    className="text-xs md:text-sm text-red-500 font-medium hover:text-red-600 transition-colors "
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05, boxShadow: '0px 0px 12px var(--tw-color-primary)' }}
                                className="w-full bg-primary text-black font-bold py-2 rounded-md transition duration-300 hover:bg-primary/80"
                            >
                                {isLogin ? 'Login' : 'Sign Up'}
                            </motion.button>
                        </form>

                        <div className="flex items-center my-5">
                            <hr className="flex-grow border border-white/50" />
                            <span className="px-3 text-white/50 text-sm">Or continue with</span>
                            <hr className="flex-grow border border-white/50" />
                        </div>

                        <button
                            onClick={() => { googleLogIn() }}
                            className="flex items-center justify-center gap-2 bg-primary-dark/20 text-[14px] text-white border border-gray-700 w-full py-3 rounded-md shadow hover:shadow-md transition"
                        >
                            <img
                                src={google_login}
                                alt="google_login"
                                className="w-5 h-5"
                            />
                            <span className="text-sm font-semibold tracking-wider">Google</span>
                        </button>


                        <p className="text-center mt-6 text-sm text-gray-400">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-primary font-medium hover:underline"
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </>
                )}

                {forgotPasswordStep == 1 && (
                    <>
                        <h2 className="text-3xl font-bold text-center mb-6">
                            Forget Password
                        </h2>
                        <form className="space-y-5" onSubmit={formik.handleSubmit}>
                            <div className="">
                                <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="resetEmail" // Bind to resetEmail
                                    placeholder="Email"
                                    onChange={formik.handleChange}
                                    value={formik.values.resetEmail}
                                    className="w-full bg-primary-dark/20 text-[14px] text-white border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                {formik.errors.resetEmail && formik.touched.resetEmail && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {formik.errors.resetEmail}
                                    </div>
                                )}
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05, boxShadow: '0px 0px 12px var(--tw-color-primary)' }}
                                className="w-full bg-primary text-black font-bold py-2 rounded-md transition duration-300 hover:bg-primary/80"
                            >
                                Email Me
                            </motion.button>
                        </form>
                    </>
                )}

                {forgotPasswordStep == 2 && (
                    <>
                        <h2 className="text-3xl font-bold text-center mb-6">
                            OTP Verification
                        </h2>
                        <p className='text-sm text-white text-center mb-4'>
                            Enter verification code we've just sent you on {email}.
                        </p>
                        <form className="" onSubmit={OtpSubmit}>
                            <div className="flex gap-2 justify-center">
                                {otp.map((digit, index) => (
                                    <input
                                        type="text"
                                        value={digit}
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength="1"
                                        ref={(ref) => (inputRefs.current[index] = ref)}
                                        key={index}
                                        className="w-10 h-10 text-center bg-primary-dark/20 text-[14px] text-white border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        onChange={(e) => OtphandleChange(e, index)}
                                        onKeyDown={(e) => OtphandleKeyDown(e, index)}
                                        onPaste={OtphandlePaste}
                                    />
                                ))}
                            </div>
                            {OtpError && (
                                <div
                                    className="text-red-500 text-sm mt-1 text-center"
                                >
                                    {OtpError}
                                </div>
                            )}

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05, boxShadow: '0px 0px 12px var(--tw-color-primary)' }}
                                className="w-full bg-primary text-black font-bold py-2 mt-5 rounded-md transition duration-300 hover:bg-primary/80"
                            >
                                Verify
                            </motion.button>
                        </form>
                    </>
                )}

                {forgotPasswordStep == 3 && (
                    <>
                        <h2 className="text-3xl font-bold text-center mb-6">
                            Reset Password
                        </h2>
                        <p className='text-sm text-white text-center mb-2'>
                            Your new password must be unique from those previously used.
                        </p>
                        <form className="space-y-5" onSubmit={formik.handleSubmit}>
                            <div className="">
                                <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={formik.values.showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        placeholder="New Password"
                                        onChange={formik.handleChange}
                                        value={formik.values.newPassword}
                                        className="w-full bg-primary-dark/20 text-[14px] text-white border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <div
                                        className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            formik.setFieldValue(
                                                "showNewPassword",
                                                !formik.values.showNewPassword
                                            );
                                        }}
                                    >
                                        {formik.values.showNewPassword ? <LuEye /> : <LuEyeClosed />}
                                    </div>
                                </div>
                                {formik.errors.newPassword && formik.touched.newPassword && formik.submitCount > 0 && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {formik.errors.newPassword}
                                    </div>
                                )}
                            </div>

                            <div className="">
                                <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={formik.values.showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        onChange={formik.handleChange}
                                        value={formik.values.confirmPassword}
                                        className="w-full bg-primary-dark/20 text-[14px] text-white border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <div
                                        className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            formik.setFieldValue(
                                                "showConfirmPassword",
                                                !formik.values.showConfirmPassword
                                            );
                                        }}
                                    >
                                        {formik.values.showConfirmPassword ? <LuEye /> : <LuEyeClosed />}
                                    </div>
                                </div>
                                {formik.errors.confirmPassword && formik.touched.confirmPassword && formik.submitCount > 0 && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {formik.errors.confirmPassword}
                                    </div>
                                )}
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05, boxShadow: '0px 0px 12px var(--tw-color-primary)' }}
                                className="w-full bg-primary text-black font-bold py-2 rounded-md transition duration-300 hover:bg-primary/80"
                            >
                                Reset Password
                            </motion.button>
                        </form>
                    </>
                )}
            </motion.div>
    )
}
