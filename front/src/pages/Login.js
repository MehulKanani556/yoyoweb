import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login, register } from '../Redux/Slice/auth.slice';
import { useDispatch } from 'react-redux';
import { LuEye, LuEyeClosed } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            userName: '',
            email: '',
            password: '',
            showPassword: false,
        },
        validationSchema: Yup.object({
            userName: !isLogin ? Yup.string().required('User Name Required') : Yup.string(),
            email: Yup.string().email('Invalid email address').required('Email is Required'),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),
        onSubmit: async (values) => {
            // console.log(values);
            const handleResponse = (response) => {
                console.log(response);
                if (response.payload.success) {
                    navigate('/');
                }
            };
            if (isLogin) {
                dispatch(login(values)).then(handleResponse);
            } else {
                dispatch(register(values)).then(handleResponse);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-md bg-[#1a1a1a] rounded-xl p-8 shadow-[0_0_30px_#00f2ff66]"
            >
                <h2 className="text-3xl font-bold text-center mb-6 neon-text">
                    {isLogin ? 'Gamer Login' : 'Create Account'}
                </h2>

                <form className="space-y-3" onSubmit={formik.handleSubmit}>
                    {!isLogin && (
                        <div className="">
                            <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                                User Name
                            </label>
                            <input
                                type="text"
                                name="userName"
                                placeholder="User Name"
                                onChange={formik.handleChange}
                                value={formik.values.userName}
                                className="w-full bg-[#111] text-[14px] text-white border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00f2ff]"
                            />
                            {formik.errors.userName && formik.touched.userName && (
                                <div className="text-red-500 text-sm mt-1">
                                    {formik.errors.userName}
                                </div>
                            )}
                        </div>
                    )}
                    <div className="">
                        <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            className="w-full bg-[#111] text-[14px] text-white border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00f2ff]"
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
                                className="w-full bg-[#111] text-[14px] text-white border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00f2ff]"
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

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05, boxShadow: '0px 0px 12px #00f2ff' }}
                        className="w-full bg-[#00f2ff] text-black font-bold py-2 rounded-md transition duration-300 hover:bg-[#00d4e6]"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </motion.button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-400">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[#00f2ff] font-medium hover:underline"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </motion.div>
        </div>
    )
}
