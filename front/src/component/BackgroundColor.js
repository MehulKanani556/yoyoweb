import React from 'react';

export default function BackgroundColor({ children, className = '' }) {
  return (
    <div className={`relative z-10 min-h-screen text-gray-200 ${className}`}>
      {/* Background layer fixed to viewport */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-gradient-to-b from-[#0f0d12] to-[#141216]">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -left-24 w-[420px] h-[420px] rounded-full bg-purple-700/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-indigo-700/30 blur-3xl" />
      </div>
      {children}
    </div>
  );
}
