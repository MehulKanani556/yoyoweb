import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { forgotPassword, googleLogin, login, register, resetPassword, verifyOtp } from '../Redux/Slice/auth.slice';
import { useDispatch, useSelector } from 'react-redux';
import { LuEye, LuEyeClosed, LuGamepad2, LuSword, LuShield, LuZap, LuStar, LuSparkles } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { getAllUserNames } from '../Redux/Slice/user.slice';
import google_login from '../Asset/images/google_login.svg';
import { useGoogleLogin } from '@react-oauth/google';
import BackgroundColor from '../component/BackgroundColor';
import swordImg from '../Asset/images/sword.png';
import marioImg from '../Asset/images/mario-removebg-preview.png';
import sonicImg from '../Asset/images/sonic-removebg-preview.png';
import pubgImg from '../Asset/images/pubgggggg-removebg-preview.png';
import freeFireChar from '../Asset/images/free-fire-character-removebg-preview.png';

export default function Login({setShowLoginModal}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const inputRefs = useRef([]);
    const constraintsRef = useRef(null);
    const formConstraintsRef = useRef(null);
    const [email, setEmail] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [OtpError, setError] = useState("");
    const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
    const userNames = useSelector((state) => state.user.allNames);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [formHasBeenDragged, setFormHasBeenDragged] = useState(false);
    const [resetKey, setResetKey] = useState(0);

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
                    .matches(/^\S*$/, 'Username cannot contain spaces')
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
            setIsLoading(true);
            try {
                if (forgotPasswordStep === 3) {
                    const { newPassword, confirmPassword } = values;
                    handleChangePassword({ newPassword, confirmPassword });
                } else if (forgotPasswordStep === 1) {
                    setEmail(values.resetEmail);
                    const response = await dispatch(forgotPassword({ email: values.resetEmail }));
                    if (response.payload.success) {
                        setForgotPasswordStep(2);
                        console.log("Password reset email sent.");
                    }
                } else {
                    const handleResponse = (response) => {
                        console.log(response);
                        if (response.payload.success) {
                            setShowLoginModal(false)
                        }
                    };
                    if (isLogin) {
                        await dispatch(login(values)).then(handleResponse);
                    } else {
                        await dispatch(register(values)).then(handleResponse);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
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
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                },
            });
            const userInfo = await res.json();

            const { name, email, sub, picture } = userInfo;
            const formattedUserName = name.replace(/\s+/g, '_');

            dispatch(googleLogin({ uid: sub, userName: formattedUserName, fullName: name, email, photo: picture })).then((response) => {
                if (response.payload.success) {
                    setShowLoginModal(false)
                }

                if (response?.payload?.user && response?.payload?.user?.role === "admin") {
                    sessionStorage.setItem('hasRedirected', 'true');
                    setShowLoginModal(false)
                    navigate("/admin")
                }
            });
        },
    });

    // Enhanced Gaming-themed floating elements with more dynamic patterns
    const FloatingIcon = ({ icon: Icon, delay, duration, className, pattern = "float" }) => {
        const patterns = {
            float: {
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
            },
            bounce: {
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
                rotate: [0, 15, -15, 0],
            },
            pulse: {
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.8, 0.3],
            },
            wave: {
                y: [0, -15, 0],
                x: [0, 10, 0],
                rotate: [0, 10, 0],
            }
        };

        return (
            <motion.div
                className={`absolute text-primary/20 ${className}`}
                animate={patterns[pattern]}
                transition={{
                    duration: duration || 4,
                    delay: delay || 0,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <Icon size={24} />
            </motion.div>
        );
    };

    // Particle background effect
    const Particle = ({ delay, duration, className, style }) => (
        <motion.div
            className={`absolute w-1 h-1 bg-primary/30 rounded-full ${className}`}
            style={style}
            animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
            }}
            transition={{
                duration: duration || 6,
                delay: delay || 0,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );

    // Sound wave effect
    const SoundWave = ({ delay, height, className }) => (
        <motion.div
            className={`w-1 bg-gradient-to-t from-primary to-purple-500 rounded-full ${className}`}
            animate={{
                height: [height * 0.3, height, height * 0.3],
                opacity: [0.3, 1, 0.3],
            }}
            transition={{
                duration: 1.5,
                delay: delay || 0,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );

    // Draggable game element (weapons/characters) with auto floating animation
    const DraggableElement = ({ src, size = 96, initialPos = { top: '10%', left: '10%' }, rotation = 0, className = '' }) => {
        const [isDragging, setIsDragging] = useState(false);
        const [hasBeenDragged, setHasBeenDragged] = useState(false);
        const animRef = useRef({
            delay: Math.random() * 1.5,
            duration: 6 + Math.random() * 4,
            ampX: 18 + Math.random() * 22,
            ampY: 10 + Math.random() * 16,
            rotAmp: 4 + Math.random() * 6,
            dir: Math.random() > 0.5 ? 1 : -1,
        });

        // Reset state when component remounts (due to key change)
        useEffect(() => {
            setIsDragging(false);
            setHasBeenDragged(false);
        }, []);

        const { delay, duration, ampX, ampY, rotAmp, dir } = animRef.current;

        return (
            <motion.img
                src={src}
                alt=""
                draggable={false}
                className={`absolute select-none pointer-events-auto cursor-grab active:cursor-grabbing drop-shadow-[0_0_10px_rgba(99,102,241,0.25)] ${className}`}
                style={{ width: size, height: 'auto', willChange: 'transform', ...initialPos }}
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.2}
                dragMomentum={false}
                onDragStart={() => {
                    setIsDragging(true);
                    setHasBeenDragged(true);
                }}
                onDragEnd={() => setIsDragging(false)}
                whileHover={{ scale: 1.04, opacity: 1 }}
                whileDrag={{ scale: 1.08, rotate: rotation + 8, opacity: 1 }}
                initial={{ opacity: 0, y: 10, rotate: rotation }}
                animate={isDragging ? {
                    opacity: 0.95,
                    rotate: rotation,
                } : hasBeenDragged ? {
                    // After being dragged, stay in the dropped position without floating
                    opacity: 0.85,
                    rotate: rotation,
                } : {
                    // Only float if never been dragged
                    opacity: 0.85,
                    x: [0, ampX * dir, -ampX * 0.6 * dir, 0],
                    y: [0, -ampY, ampY, 0],
                    rotate: [rotation, rotation + rotAmp * dir, rotation - rotAmp * dir, rotation],
                }}
                transition={isDragging ? {
                    type: 'spring', stiffness: 120, damping: 14
                } : hasBeenDragged ? {
                    type: 'spring', stiffness: 100, damping: 20
                } : {
                    duration,
                    delay,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />
        );
    };

    return (
        <BackgroundColor className='pt-8 md:pt-16 px-4 relative overflow-hidden'>
            {/* Enhanced Particle Background */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <Particle
                        key={i}
                        delay={i * 0.3}
                        duration={4 + Math.random() * 4}
                        className={`top-${Math.floor(Math.random() * 100)}% left-${Math.floor(Math.random() * 100)}%`}
                    />
                ))}
            </div>

            {/* Enhanced Gaming-themed floating elements */}
            <FloatingIcon icon={LuGamepad2} delay={0} pattern="bounce" className="top-20 left-10 md:left-20" />
            <FloatingIcon icon={LuSword} delay={1} pattern="wave" className="top-32 right-8 md:right-20" />
            <FloatingIcon icon={LuShield} delay={2} pattern="pulse" className="bottom-40 left-16 md:left-32" />
            <FloatingIcon icon={LuZap} delay={3} pattern="float" className="bottom-32 right-16 md:right-32" />
            <FloatingIcon icon={LuStar} delay={1.5} pattern="bounce" className="top-48 left-1/2 transform -translate-x-1/2" />
            <FloatingIcon icon={LuSparkles} delay={2.5} pattern="pulse" className="bottom-48 left-1/2 transform -translate-x-1/2" />

            {/* Draggable game elements container (weapons/characters) */}
            <div ref={constraintsRef} className="absolute inset-0 z-30 pointer-events-auto" key={resetKey}>
                <DraggableElement key={`sword-${resetKey}`} src={swordImg} size={88} initialPos={{ top: '18%', left: '4%' }} rotation={-20} className="opacity-80 hover:opacity-100" />
                <DraggableElement key={`mario-${resetKey}`} src={marioImg} size={120} initialPos={{ bottom: '10%', left: '6%' }} rotation={0} className="opacity-90 hover:opacity-100" />
                <DraggableElement key={`sonic-${resetKey}`} src={sonicImg} size={110} initialPos={{ top: '12%', left: '72%' }} rotation={5} className="opacity-80 hover:opacity-100" />
                <DraggableElement key={`pubg-${resetKey}`} src={pubgImg} size={120} initialPos={{ bottom: '14%', left: '76%' }} rotation={-5} className="opacity-85 hover:opacity-100" />
                <DraggableElement key={`freefire-${resetKey}`} src={freeFireChar} size={130} initialPos={{ top: '58%', left: '42%' }} rotation={0} className="opacity-85 hover:opacity-100 hidden md:block" />
            </div>

            {/* Sound Wave Effect */}
            <div className="absolute top-10 right-10 md:right-20 flex items-end gap-1 h-16">
                {[...Array(5)].map((_, i) => (
                    <SoundWave
                        key={i}
                        delay={i * 0.1}
                        height={16 + i * 8}
                        className="opacity-60"
                    />
                ))}
            </div>

            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                {/* Draggable form container */}
                <motion.div
                    drag
                    dragElastic={0.1}
                    dragMomentum={false}
                    onDragStart={() => {
                        console.log('Form drag started');
                        setFormHasBeenDragged(true);
                    }}
                    onDrag={() => console.log('Form dragging')}
                    onDragEnd={() => {
                        console.log('Form drag ended');
                        // Add a subtle bounce effect when dropped
                        setTimeout(() => {
                            // This will trigger a subtle animation
                        }, 100);
                    }}
                    whileDrag={{ 
                        scale: 1.02,
                        boxShadow: "0 0 30px rgba(99, 102, 241, 0.6)",
                        zIndex: 50,
                        rotate: [0, 1, -1, 0]
                    }}
                    whileHover={{ 
                        scale: 1.01,
                        boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)"
                    }}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ 
                        opacity: 1, 
                        y: formHasBeenDragged ? 0 : [0, -3, 0],
                        scale: 1
                    }}
                    transition={{ 
                        duration: 0.8, 
                        ease: "easeOut",
                        type: "spring",
                        stiffness: 100,
                        y: formHasBeenDragged ? {
                            type: "spring",
                            stiffness: 100,
                            damping: 20
                        } : {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                    className="relative w-full max-w-md cursor-grab active:cursor-grabbing select-none mx-auto"
                    style={{ touchAction: "none" }}
                >
                    {/* Enhanced Glowing border effect with color cycling */}
                    <motion.div 
                        className="absolute inset-0 rounded-2xl blur-xl opacity-30"
                        animate={{
                            background: [
                                "linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899)",
                                "linear-gradient(45deg, #ec4899, #f59e0b, #10b981)",
                                "linear-gradient(45deg, #10b981, #3b82f6, #6366f1)",
                            ]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    
                    {/* Enhanced glow effect that intensifies on hover/drag */}
                    <motion.div 
                        className="absolute inset-0 rounded-2xl blur-2xl opacity-0"
                        whileHover={{ opacity: 0.2 }}
                        whileDrag={{ opacity: 0.4 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            background: "radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(139, 92, 246, 0.4) 50%, transparent 100%)"
                        }}
                    />
                    
                    <div className="relative z-40 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl shadow-primary/30 p-6 md:p-8 overflow-hidden">
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#6366f1_1px,_transparent_1px)] bg-[length:20px_20px]" />
                        </div>

                        {/* Header with enhanced gaming theme */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-center mb-8 relative z-10"
                        >
                            {/* Drag indicator */}
                            <motion.div
                                className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-primary/40 text-xs font-medium bg-gray-800/80 px-3 py-1 rounded-full border border-primary/30"
                                animate={{ 
                                    y: [0, -2, 0],
                                    opacity: [0.4, 0.8, 0.4]
                                }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                            >
                                ✋ Drag to move
                            </motion.div>
                            
                            {/* Drag handle bar */}
                            <motion.div
                                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary/60 to-purple-500/60 rounded-full cursor-grab active:cursor-grabbing"
                                whileHover={{ 
                                    scale: 1.2,
                                    backgroundColor: "rgba(99, 102, 241, 0.8)"
                                }}
                                animate={{
                                    opacity: [0.6, 1, 0.6]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            
                            <div className="flex justify-center mb-4">
                                <motion.div
                                    animate={{ 
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ 
                                        duration: 4, 
                                        repeat: Infinity, 
                                        ease: "easeInOut" 
                                    }}
                                    className="relative w-16 h-16 bg-gradient-to-br from-primary via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-primary/40"
                                >
                                    {/* Inner glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-purple-600/50 rounded-full blur-sm" />
                                    <LuGamepad2 size={32} className="text-white relative z-10" />
                                </motion.div>
                            </div>
                            <motion.h2 
                                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-white to-purple-400 bg-clip-text text-transparent"
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                style={{
                                    backgroundSize: "200% 200%"
                                }}
                            >
                                {isLogin ? 'Gamer Login' : 'Create Account'}
                            </motion.h2>
                            <motion.p 
                                className="text-gray-400 text-sm mt-2"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {isLogin ? 'Ready to level up?' : 'Join the ultimate gaming community'}
                            </motion.p>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {forgotPasswordStep === 0 && (
                                <motion.div
                                    key="login-form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative z-10"
                                >
                                    <form className="space-y-4" onSubmit={formik.handleSubmit}>
                                        {!isLogin && (
                                            <>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                >
                                                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                                                        Full Name
                                                    </label>
                                                    <motion.input
                                                        type="text"
                                                        name="fullName"
                                                        placeholder="Enter your full name"
                                                        onChange={formik.handleChange}
                                                        value={formik.values.fullName}
                                                        whileFocus={{ scale: 1.02 }}
                                                        className="w-full bg-gray-800/60 text-white border border-gray-600/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder-gray-400 backdrop-blur-sm hover:bg-gray-800/80"
                                                    />
                                                    {formik.errors.fullName && formik.touched.fullName && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-red-400 text-sm mt-1 flex items-center gap-1"
                                                        >
                                                            <span className="w-1 h-1 bg-red-400 rounded-full" />
                                                            {formik.errors.fullName}
                                                        </motion.div>
                                                    )}
                                                </motion.div>

                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                                                        Username
                                                    </label>
                                                    <motion.input
                                                        type="text"
                                                        name="userName"
                                                        placeholder="Choose a unique username"
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
                                                        whileFocus={{ scale: 1.02 }}
                                                        className="w-full bg-gray-800/60 text-white border border-gray-600/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder-gray-400 backdrop-blur-sm hover:bg-gray-800/80"
                                                    />
                                                    {formik.touched.userName && (
                                                        <>
                                                            {formik.errors.userName ? (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                                                                >
                                                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                                                    {formik.errors.userName}
                                                                </motion.div>
                                                            ) : (
                                                                formik.values.userName && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: -10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        className={`text-sm mt-1 flex items-center gap-1 ${isUserNameTaken() ? 'text-red-400' : 'text-green-400'}`}
                                                                    >
                                                                        <span className={`w-1 h-1 rounded-full ${isUserNameTaken() ? 'bg-red-400' : 'bg-green-400'}`} />
                                                                        {isUserNameTaken() ? 'Username already taken' : 'Username available'}
                                                                    </motion.div>
                                                                )
                                                            )}
                                                        </>
                                                    )}
                                                </motion.div>
                                            </>
                                        )}

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                                {isLogin ? "Email or Username" : "Email"}
                                            </label>
                                            <motion.input
                                                type={isLogin ? "text" : "email"}
                                                name="email"
                                                placeholder={isLogin ? "Enter email or username" : "Enter your email"}
                                                onChange={formik.handleChange}
                                                value={formik.values.email}
                                                whileFocus={{ scale: 1.02 }}
                                                className="w-full bg-gray-800/60 text-white border border-gray-600/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder-gray-400 backdrop-blur-sm hover:bg-gray-800/80"
                                            />
                                            {formik.errors.email && formik.touched.email && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                                                >
                                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                                    {formik.errors.email}
                                                </motion.div>
                                            )}
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <motion.input
                                                    type={formik.values.showPassword ? "text" : "password"}
                                                    name="password"
                                                    placeholder="Enter your password"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.password}
                                                    whileFocus={{ scale: 1.02 }}
                                                    className="w-full bg-gray-800/60 text-white border border-gray-600/50 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder-gray-400 backdrop-blur-sm hover:bg-gray-800/80"
                                                />
                                                <motion.button
                                                    type="button"
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        formik.setFieldValue(
                                                            "showPassword",
                                                            !formik.values.showPassword
                                                        );
                                                    }}
                                                >
                                                    {formik.values.showPassword ? <LuEye size={20} /> : <LuEyeClosed size={20} />}
                                                </motion.button>
                                            </div>
                                            {formik.errors.password && formik.touched.password && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                                                >
                                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                                    {formik.errors.password}
                                                </motion.div>
                                            )}
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-right"
                                        >
                                            <motion.button
                                                onClick={() => { setForgotPasswordStep(1); }}
                                                type="button"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="text-sm text-primary hover:text-primary/80 transition-colors duration-300 hover:underline"
                                            >
                                                Forgot Password?
                                            </motion.button>
                                        </motion.div>

                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            whileHover={{ 
                                                scale: 1.02,
                                                boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)"
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                                        >
                                            {/* Animated background */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-primary"
                                                animate={{
                                                    x: ["-100%", "100%"]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                            />
                                            <span className="relative z-10">
                                                {isLoading ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                                                    />
                                                ) : (
                                                    isLogin ? 'Login' : 'Sign Up'
                                                )}
                                            </span>
                                        </motion.button>
                                    </form>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="mt-6"
                                    >
                                        <div className="flex items-center my-4">
                                            <hr className="flex-grow border border-gray-600/50" />
                                            <span className="px-4 text-gray-400 text-sm">Or continue with</span>
                                            <hr className="flex-grow border border-gray-600/50" />
                                        </div>

                                        <motion.button
                                            onClick={() => { googleLogIn() }}
                                            whileHover={{ 
                                                scale: 1.02,
                                                backgroundColor: "rgba(55, 65, 81, 0.8)"
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center justify-center gap-3 bg-gray-800/60 text-white border border-gray-600/50 w-full py-3 rounded-lg hover:bg-gray-700/60 transition-all duration-300 hover:border-gray-500/50 backdrop-blur-sm"
                                        >
                                            <img
                                                src={google_login}
                                                alt="google_login"
                                                className="w-5 h-5"
                                            />
                                            <span className="font-medium">Continue with Google</span>
                                        </motion.button>

                                        <p className="text-center mt-6 text-sm text-gray-400">
                                            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                                            <motion.button
                                                onClick={() => setIsLogin(!isLogin)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="text-primary font-medium hover:text-primary/80 transition-colors duration-300 hover:underline"
                                            >
                                                {isLogin ? 'Sign Up' : 'Login'}
                                            </motion.button>
                                        </p>
                                    </motion.div>
                                </motion.div>
                            )}

                            {forgotPasswordStep === 1 && (
                                <motion.div
                                    key="forgot-password"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-center mb-6"
                                    >
                                        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent">
                                            Reset Password
                                        </h2>
                                        <p className="text-gray-400 text-sm mt-2">
                                            Enter your email to receive reset instructions
                                        </p>
                                    </motion.div>

                                    <form className="space-y-5" onSubmit={formik.handleSubmit}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                                Email
                                            </label>
                                            <motion.input
                                                type="email"
                                                name="resetEmail"
                                                placeholder="Enter your email"
                                                onChange={formik.handleChange}
                                                value={formik.values.resetEmail}
                                                whileFocus={{ scale: 1.02 }}
                                                className="w-full bg-gray-800/60 text-white border border-gray-600/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder-gray-400 backdrop-blur-sm hover:bg-gray-800/80"
                                            />
                                            {formik.errors.resetEmail && formik.touched.resetEmail && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                                                >
                                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                                    {formik.errors.resetEmail}
                                                </motion.div>
                                            )}
                                        </motion.div>

                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            whileHover={{ 
                                                scale: 1.02,
                                                boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)"
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                                        >
                                            {/* Animated background */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-primary"
                                                animate={{
                                                    x: ["-100%", "100%"]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                            />
                                            <span className="relative z-10">
                                                {isLoading ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                                                    />
                                                ) : (
                                                    'Send Reset Email'
                                                )}
                                            </span>
                                        </motion.button>
                                    </form>
                                </motion.div>
                            )}

                            {forgotPasswordStep === 2 && (
                                <motion.div
                                    key="otp-verification"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-center mb-6"
                                    >
                                        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent">
                                            OTP Verification
                                        </h2>
                                        <p className="text-sm text-gray-400 mt-2">
                                            Enter the 6-digit code sent to <span className="text-primary">{email}</span>
                                        </p>
                                    </motion.div>

                                    <form onSubmit={OtpSubmit}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="flex gap-3 justify-center mb-6"
                                        >
                                            {otp.map((digit, index) => (
                                                <motion.input
                                                    key={index}
                                                    type="text"
                                                    value={digit}
                                                    inputMode="numeric"
                                                    autoComplete="one-time-code"
                                                    maxLength="1"
                                                    ref={(ref) => (inputRefs.current[index] = ref)}
                                                    className="w-12 h-12 text-center bg-gray-800/60 text-white border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-lg font-bold backdrop-blur-sm hover:bg-gray-800/80"
                                                    onChange={(e) => OtphandleChange(e, index)}
                                                    onKeyDown={(e) => OtphandleKeyDown(e, index)}
                                                    onPaste={OtphandlePaste}
                                                    whileFocus={{ scale: 1.1 }}
                                                />
                                            ))}
                                        </motion.div>

                                        {OtpError && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-400 text-sm text-center mb-4 flex items-center justify-center gap-1"
                                            >
                                                <span className="w-1 h-1 bg-red-400 rounded-full" />
                                                {OtpError}
                                            </motion.div>
                                        )}

                                        <motion.button
                                            type="submit"
                                            whileHover={{ 
                                                scale: 1.02,
                                                boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)"
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 relative overflow-hidden"
                                        >
                                            {/* Animated background */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-primary"
                                                animate={{
                                                    x: ["-100%", "100%"]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                            />
                                            <span className="relative z-10">Verify OTP</span>
                                        </motion.button>
                                    </form>
                                </motion.div>
                            )}

                            {forgotPasswordStep === 3 && (
                                <motion.div
                                    key="reset-password"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-center mb-6"
                                    >
                                        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent">
                                            Set New Password
                                        </h2>
                                        <p className="text-sm text-gray-400 mt-2">
                                            Create a strong new password for your account
                                        </p>
                                    </motion.div>

                                    <form className="space-y-5" onSubmit={formik.handleSubmit}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={formik.values.showNewPassword ? "text" : "password"}
                                                    name="newPassword"
                                                    placeholder="Enter new password"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.newPassword}
                                                    className="w-full bg-gray-800/50 text-white border border-gray-600/50 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder-gray-400"
                                                />
                                                <motion.button
                                                    type="button"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        formik.setFieldValue(
                                                            "showNewPassword",
                                                            !formik.values.showNewPassword
                                                        );
                                                    }}
                                                >
                                                    {formik.values.showNewPassword ? <LuEye size={20} /> : <LuEyeClosed size={20} />}
                                                </motion.button>
                                            </div>
                                            {formik.errors.newPassword && formik.touched.newPassword && formik.submitCount > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                                                >
                                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                                    {formik.errors.newPassword}
                                                </motion.div>
                                            )}
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <motion.input
                                                    type={formik.values.showConfirmPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    placeholder="Confirm new password"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.confirmPassword}
                                                    whileFocus={{ scale: 1.02 }}
                                                    className="w-full bg-gray-800/60 text-white border border-gray-600/50 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder-gray-400 backdrop-blur-sm hover:bg-gray-800/80"
                                                />
                                                <motion.button
                                                    type="button"
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        formik.setFieldValue(
                                                            "showConfirmPassword",
                                                            !formik.values.showConfirmPassword
                                                        );
                                                    }}
                                                >
                                                    {formik.values.showConfirmPassword ? <LuEye size={20} /> : <LuEyeClosed size={20} />}
                                                </motion.button>
                                            </div>
                                            {formik.errors.confirmPassword && formik.touched.confirmPassword && formik.submitCount > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                                                >
                                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                                    {formik.errors.confirmPassword}
                                                </motion.div>
                                            )}
                                        </motion.div>

                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            whileHover={{ 
                                                scale: 1.02,
                                                boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)"
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                                        >
                                            {/* Animated background */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-primary"
                                                animate={{
                                                    x: ["-100%", "100%"]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                            />
                                            <span className="relative z-10">
                                                {isLoading ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                                                    />
                                                ) : (
                                                    'Reset Password'
                                                )}
                                            </span>
                                        </motion.button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* Mouse trail effect */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/20 rounded-full"
                        animate={{
                            x: [0, Math.random() * window.innerWidth],
                            y: [0, Math.random() * window.innerHeight],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 1.5
                        }}
                    />
                ))}
            </div>
        </BackgroundColor>
    )
}
