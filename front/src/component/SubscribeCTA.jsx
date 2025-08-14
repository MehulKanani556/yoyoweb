import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../Utils/axiosInstance';

const SubscribeCTA = () => {
    const [email, setEmail] = useState('');
    const [agree, setAgree] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email.trim()) {
            setError('Please enter your email.');
            return;
        }
        if (!agree) {
            setError('Please agree to the Privacy Policy and Terms & Conditions.');
            return;
        }

        try {
            setSubmitting(true);
            const response = await axiosInstance.post('/createsubscribe', { email });
            if (response?.data?.success) {
                setSuccess('Thanks for subscribing!');
                setEmail('');
                setAgree(false);
            } else {
                setError(response?.data?.message || 'Something went wrong.');
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to subscribe.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="relative overflow-hidden py-20 sm:py-24 text-white px-4 sm:px-6 lg:px-8 ">
            <div className="relative max-w-[80%] w-full mx-auto ">
                {/* Neon gradient frame */}
                <div className="rounded-2xl md:rounded-3xl p-[1px] bg-[length:200%_200%] animate-gradient-x ">
                    {/* Background border shadow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-2xl blur opacity-60" />
                    <div className="relative rounded-2xl md:rounded-3xl border border-white/10  backdrop-blur-md ">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center p-6 sm:p-10 bg-[#1b1920]/90 rounded-[25px]">
                            {/* Left: copy */}
                            <div>
                                <p className="inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-widest uppercase text-white/70">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(255,100,0,0.6)]" />
                                    News, drops & beta access
                                </p>
                                <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                                    Join the <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">YOYO</span> Squad
                                </h2>
                                <p className="mt-4 sm:mt-6 text-gray-400 max-w-2xl text-sm sm:text-base">
                                    Get early access to new games, exclusive rewards, and secret discounts. Zero spam — unsubscribe anytime.
                                </p>
                            </div>

                            {/* Right: form */}
                            <form onSubmit={handleSubmit} className="w-full">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">
                                        <div className="relative w-full sm:flex-1">
                                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">@</span>
                                            <input
                                                type="email"
                                                placeholder="your@email.com"
                                                className="w-full sm:flex-1 min-w-0 rounded-lg bg-[#0f0f11] border border-neutral-800 pl-9 pr-4 py-3 sm:py-4 outline-none focus:border-neutral-600 text-sm sm:text-base"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                aria-label="Email address"
                                                aria-invalid={Boolean(error)}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-primary active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {submitting ? 'Submitting...' : 'Subscribe'}
                                        </button>
                                    </div>

                                    <label className="inline-flex items-center gap-3 text-sm text-gray-400 select-none">
                                        <span
                                            role="checkbox"
                                            aria-checked={agree}
                                            onClick={() => setAgree((v) => !v)}
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === ' ' || e.key === 'Enter') setAgree((v) => !v);
                                            }}
                                            className={`h-4 w-4 rounded-full border-2 ${agree ? 'bg-orange-600 border-orange-600' : 'border-orange-600'} cursor-pointer`}
                                        />
                                        <span>
                                            I agree with{' '}
                                            <Link to="/privacyPolicy" className="text-orange-500 hover:text-orange-400">Privacy Policy</Link>
                                            {' '}and{' '}
                                            <Link to="/termsCondition" className="text-orange-500 hover:text-orange-400">Terms & Conditions</Link>
                                        </span>
                                    </label>

                                    {error ? (
                                        <p className="text-sm text-red-500" role="alert" aria-live="polite">{error}</p>
                                    ) : null}
                                    {success ? (
                                        <p className="text-sm text-green-500" role="status" aria-live="polite">{success}</p>
                                    ) : null}
                                </div>
                            </form>
                        </div>

                        {/* Orbiting ring accent */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full"
                            style={{
                                background:
                                    'conic-gradient(from 0deg, rgba(251,191,36,0.18), transparent 25%, rgba(236,72,153,0.2) 50%, transparent 75%, rgba(251,191,36,0.18))',
                                boxShadow: '0 0 20px rgba(251,191,36,0.15), inset 0 0 40px rgba(251,191,36,0.08)',
                                animation: 'spinSlow 22s linear infinite',
                                filter: 'blur(0.5px)'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* local keyframes to match hero spin */}
            <style>{`@keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </section>
    );
};

export default SubscribeCTA;


