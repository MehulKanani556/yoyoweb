import React from 'react';
import { FaCertificate, FaGift, FaHeadset, FaShieldAlt, FaTags } from 'react-icons/fa';
import { FaTruckFast } from "react-icons/fa6";

const Features = () => {

    const features = [
        {
            icon: <FaHeadset size={28} />,
            title: "24/7 Customer Support",
            desc: "Get instant help from our friendly support team anytime, anywhere.",
        },
        {
            icon: <FaGift size={28} />,
            title: "Exclusive Game Rewards",
            desc: "Earn reward points and exclusive in-game items with every purchase.",
        },
        {
            icon: <FaTruckFast size={28} />,
            title: "Fast Delivery",
            desc: "Instant digital delivery for games and add-ons after purchase.",
        },
        {
            icon: <FaTags size={28} />,
            title: "Best Deals & Discounts",
            desc: "Grab massive discounts and seasonal offers on top titles.",
        },
        {
            icon: <FaShieldAlt size={28} />,
            title: "Secure Payments",
            desc: "All transactions are encrypted and 100% secure.",
        },
        {
            icon: <FaCertificate size={28} />,
            title: "Authorized Seller",
            desc: "We are an officially licensed seller for top gaming brands.",
        },
    ];

    return (
        <section className=" text-white py-16">
            <div className="max-w-[80%] mx-auto px-4">
                <h2 className="text-4xl font-extrabold mb-12">
                    Level Up Your <br /> Gaming Shopping
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group rounded-lg p-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20"
                        >
                            <div className="bg-neutral-900 p-6 rounded-lg h-full">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-primary transition-transform duration-300 group-hover:scale-110">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-400 mb-4">{feature.desc}</p>
                                <button className="text-sm text-white underline underline-offset-4 flex items-center gap-1 hover:text-purple-400 transition-transform duration-300 group-hover:translate-x-1">
                                    Shop Now →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
