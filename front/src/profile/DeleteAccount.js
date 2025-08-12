import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import { ImSpinner9 } from "react-icons/im";
import { deleteUser, sendDeleteOtp, verifyDeleteOtp } from "../Redux/Slice/user.slice";
import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const navigate = useNavigate();
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [isEmailInput, setIsEmailInput] = useState(true);
  const loading = useSelector((state) => state.user.loading);
  const currentUser = useSelector((state) => state.user.currUser);
  const [identifier, setIdentifier] = useState("");

  const getMaskedIdentifier = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(identifier)) {
      return identifier;
    } else if (/^\d{10}$/.test(identifier)) {
      return `+91******${identifier.slice(-4)}`;
    }
    return identifier;
  };

  const getVerificationLabel = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(identifier)) {
      return "Email";
    } else if (/^\d{10}$/.test(identifier)) {
      return "Mobile Number";
    }
    return "account";
  };

  const handleDeleteAccount = () => {
    setShowModal(true);
  };

  const confirmDelete = () => {
    setShowModal(false);
    setShowOtpModal(true);
    setOtpModalVisible(true);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setShowOtpModal(false);
  };

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const verifyOtp = () => {
    console.log("Verifying OTP:", otp);
    setShowOtpModal(false);
  };

  const length = 4
  const onComplete = (otpValue) => { }

  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [error, setError] = useState("");

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    const otpValue = newOtp.join("");
    if (otpValue.length === length) {
      onComplete?.(otpValue);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);

    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split("").forEach((digit, index) => {
        if (index < length) {
          newOtp[index] = digit;
        }
      });
      setOtp(newOtp);

      if (pastedData.length === length) {
        onComplete?.(pastedData);
      }
      // Focus last filled input or first empty input
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex].focus();
    }
  };

  const handleotpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== length) {
      setError("Please enter the complete OTP.");
      return;
    }
    setError("");
    console.log(otpValue);
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let payload = { otp: otpValue };
      if (emailRegex.test(identifier)) {
        payload.email = identifier;
      } else {
        payload.phoneNo = identifier;
      }
      const response = await dispatch(verifyDeleteOtp(payload));
      if (response.payload.success) {
        dispatch(deleteUser(currentUser._id)).then((response) => {
          navigate("/")
          sessionStorage.removeItem("userId");
          sessionStorage.removeItem("token");
        })
      } else {
        setError("OTP verification failed. Please try again.");
      }
    } catch (error) {
      setError("Error verifying OTP. Please try again.");
    }
  };

  return (
    <div className="bg-[#141414] border-[2px] border-white/20 text-white p-4 md:p-6 lg:p-8 rounded-lg relative">
      <h2 className="text-base md:text-xl font-semibold mb-6">
        When you deactivate your account
      </h2>

      <ul className="space-y-4 mb-[35px]">
        {[
          "Your watch history and saved content will be permanently deleted.",
          "You will be logged out of all devices.",
          "Your subscription (if active) will be cancelled.",
          "You will no longer receive recommendations, offers, or notifications from us.",
          "Your profile and preferences will not be recoverable.",
        ].map((item, idx) => (
          <li className="flex items-start text-sm md:text-base" key={idx}>
            <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-300">{item}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={handleDeleteAccount}
        className="text-white bg-primary font-normal py-[6px] md600:py-[10px] px-[6px] md600:px-[10px] rounded-[4px] duration-200 w-full sm:w-[50%] lg:w-[30%] transition-[background-position] duration-400 ease-in-out"
       
        onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = 'right center')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = 'left center')}
      >
        Delete Account
      </button>

      {/* First Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#141414] p-3 md:p-6 text-white w-[310px] sm:w-[400px]">
            <div className="flex justify-between items-center border-b-[1px] border-white/10 pb-[12px] mb-[12px]">
              <h1 className="text-lg font-semibold ">Delete Account</h1>
              <button
                onClick={cancelDelete}
                className="text-white hover:text-red-500 transition duration-200"
              >
                <AiOutlineClose className="text-xl" />
              </button>
            </div>
            <Formik
              initialValues={{
                emailOrPhone: "",
                showPassword: false,
              }}
              validationSchema={Yup.object().shape({
                emailOrPhone: Yup.string()
                  .required("Email or Phone is required")
                  .test(
                    "email-or-phone",
                    "Please enter a valid email or phone number",
                    function (value) {
                      if (!value) return false;
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      const phoneRegex = /^[0-9]{10}$/;
                      return (
                        emailRegex.test(value) || phoneRegex.test(value)
                      );
                    }
                  ),
              })}
              onSubmit={async (values) => {
                // Determine if input is email or phone number
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const isEmail = emailRegex.test(values.emailOrPhone);
                setIdentifier(values.emailOrPhone);
                let resultAction;

                if (isEmail) {
                  resultAction = await dispatch(sendDeleteOtp({ email: values.emailOrPhone })).then((response) => {
                    if (response.payload?.success) {
                      setShowModal(false);
                      setShowOtpModal(true);
                    }
                  });
                } else {
                  resultAction = await dispatch(sendDeleteOtp({ phoneNo: values.emailOrPhone })).then((response) => {
                    if (response.payload?.success) {
                      setShowModal(false);
                      setShowOtpModal(true);
                    }
                  });
                }
              }}
            >
              {({ values, errors, touched, handleSubmit, handleChange, setFieldValue, }) => (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col relative m-0 md:m-[22px] md:mb-0">
                    <div className="w-full flex flex-col">
                      {isEmailInput ? (
                        <input
                          type="text"
                          placeholder="Email"
                          name="emailOrPhone"
                          className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                          value={values.emailOrPhone}
                          onChange={(e) => {
                            handleChange(e);
                            const value = e.target.value;
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            setIsEmailInput(emailRegex.test(value));
                          }}
                        />
                      ) : (
                        <div className="flex items-center w-full relative">
                          <span className="text-white px-2 pb-[2px] text-[13px] absolute left-0 border-r border-[#fff]/40 mr-2 pointer-events-none select-none">
                            +91
                          </span>
                          <input
                            type="tel"
                            placeholder="Mobile Number"
                            name="emailOrPhone"
                            maxLength={10}
                            className="w-full bg-[#232323] text-[13px] text-white p-2 pl-12 rounded j_input_field"
                            value={values.emailOrPhone.replace(/^\+?91/, "")}
                            onChange={(e) => {
                              let val = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                              setFieldValue("emailOrPhone", val);
                            }}
                            autoFocus
                          />
                        </div>
                      )}
                      {errors.emailOrPhone && touched.emailOrPhone && (
                        <div className="text-red-500 text-sm mt-2">
                          {errors.emailOrPhone}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between mt-[30px] gap-2">
                      <button
                        onClick={cancelDelete}
                        className="bg-white/10 hover:bg-white/20 text-[14px] w-full text-white py-2 rounded-[4px] "
                      >
                        Cancel
                      </button>
                      <button
                        disabled={loading}
                        type="submit"
                        className="text-white bg-primary text-center font-medium py-2 rounded-[4px] w-full duration-200 transition-[background-position] duration-400 ease-in-out flex items-center justify-center"
                       
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = 'right center')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = 'left center')}
                      >
                        {loading ? (
                          <ImSpinner9 className="animate-spin mx-auto" />
                        ) : (
                          'Send OTP'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#141414] p-3 md:p-6 text-white w-[310px] sm:w-[400px]">

            {/* Title */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
              <h2 className="text-xl md:text-lg font-bold text-white text-center mb-2">Verify OTP</h2>
              <button onClick={cancelDelete}>
                <AiOutlineClose className="text-xl text-white hover:text-red-500" />
              </button>
            </div>

            <p className="text-white/60 text-center mb-6 text-xs md:text-sm">
              We’ve sent a code to <span className='text-white underline'>{getMaskedIdentifier()}</span><br />
              Please enter it to verify your {getVerificationLabel()}.
            </p>
            <form onSubmit={handleotpSubmit}>
              <div className="flex justify-center space-x-2 sm:space-x-4 mb-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(ref) => inputRefs.current[index] = ref}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={digit}
                    placeholder='_'
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    maxLength={1}
                    className="w-12 h-12 bg-white/10 border border-white/20 rounded text-white text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                  />
                ))}
              </div>
              {error && <div className="text-red-500 text-center text-sm my-1">{error}</div>}

              <button type="submit" className="mt-10 w-full font-medium rounded py-2 sm:py-3 text-white border-none cursor-pointer transition-[background-position] duration-400 ease-in-out bg-primary"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = 'right center')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = 'left center')}>
                Delete Account
              </button>
            </form>
            <div className="text-center mt-5">
              <p className='text-white/60 text-xs md:text-sm'>Didn’t received code? <span className='text-white underline'>Resend</span></p>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default DeleteAccount;
