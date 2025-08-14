import React from "react";

const HyperButton = ({
    label = "Button",
    icon: Icon,
    onClick,
    size = "md", // sm | md | lg
    className = "",
    disabled = false,
    fullWidth = false,
    type = "button",
}) => {
    const sizes = {
        sm: "px-4 py-1.5 text-xs rounded-xl",
        md: "px-6 py-2.5 text-sm rounded-2xl",
        lg: "px-8 py-3 text-base rounded-3xl",
    };

    return (
        <div className={`group relative inline-block ${fullWidth ? "w-full" : ""}`}>
            <div className="pointer-events-none absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 animate-gradient-x opacity-70 group-hover:opacity-100 blur-[3px] group-hover:blur-[8px] transition-all duration-500"></div>

            <div
                type={type}
                disabled={disabled}
                onClick={onClick}
                className={`
					relative z-10 ${sizes[size]}
					inline-flex items-center justify-center gap-2 w-full
					bg-black/60 backdrop-blur border border-white/10 text-white
					shadow-[0_12px_40px_-12px_rgba(168,85,247,0.45)]
					transition-all duration-300
					hover:scale-[1.03] hover:-translate-y-0.5
					active:scale-[0.99] active:translate-y-[1px]
					${className}
				`}
            >
                <span className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background:
                            "radial-gradient(1200px 180px at 50% 0%, rgba(168,85,247,0.12), rgba(255,255,255,0) 60%)",
                    }}
                />
                {/* <span className="pointer-events-none absolute -left-[40%] top-0 h-full w-1/2 rounded-[inherit] bg-gradient-to-r fr  om-white/20 to-transparent skew-x-[-20deg] translate-x-0 group-hover:translate-x-[240%] transition-transform duration-700 ease-out" /> */}

                {Icon ? <Icon className="h-4 w-4 text-white/90" /> : null}
                <span className="relative">{label}</span>
            </div>
        </div>
    );
};

export default HyperButton;