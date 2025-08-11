import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllTerms } from '../../Redux/Slice/TermsCondition.slice';

const TermsCondition = () => {

    const dispatch = useDispatch();
    const terms = useSelector((state) => state.term.Terms);

    useEffect(() => {
        dispatch(getAllTerms());
    }, []);

    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-10 bg-primary-dark text-primary-light">
            <div className="w-full max-w-2xl bg-primary-dark bg-opacity-80 rounded-lg shadow-lg p-6 md:p-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Terms and Conditions</h1>
                <p className="text-base md:text-lg text-gray-300 text-center mb-6">
                    Please read these terms and conditions carefully before using our website. By accessing or using our service, you agree to be bound by these terms. If you disagree with any part of the terms, then you may not access the service.
                </p>
                <div className="space-y-3">
                    {terms.map((term, idx) => (
                        <div key={idx} className="border border-gray-700 rounded-md bg-primary-dark">
                            <button
                                className="w-full flex justify-between items-center px-4 py-3 focus:outline-none text-left text-gray-200 md:text-base text-sm"
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            >
                                {/* <span>Term {idx + 1}</span> */}
                                <strong>{term.title}</strong>
                                <svg
                                    className={`w-5 h-5 transform transition-transform duration-200 ${openIndex === idx ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openIndex === idx && (
                                <div className="px-4 pb-4 text-gray-300 animate-fade-in-down">

                                    <p>{term.description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TermsCondition
