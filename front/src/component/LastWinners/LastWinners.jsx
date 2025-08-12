import React, { useEffect, useRef, useState } from 'react';

export default function LastWinners({ tick = 0, onActiveChange }) {
    const cardRef = useRef(null);
    const listRef = useRef(null);
    const itemRefs = useRef([]);
    const isResettingRef = useRef(false);
    const scrollAnimRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalMs = 2000;

    const handleMouseMove = (event) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const maxTiltDeg = 15;
        const rotateY = ((mouseX - centerX) / centerX) * maxTiltDeg;
        const rotateX = -((mouseY - centerY) / centerY) * maxTiltDeg;

        card.style.setProperty('--x', `${mouseX}px`);
        card.style.setProperty('--y', `${mouseY}px`);

        card.style.transition = 'transform 50ms ease-out';
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transition = 'transform 300ms ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    const winners = [
        {
            id: 'w1',
            name: 'Pubg',
            amount: 350,
            avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=cristof',
        },
        {
            id: 'w2',
            name: 'Free Fire',
            amount: 250,
            avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=luna',
        },
        {
            id: 'w3',
            name: 'Fighting',
            amount: 350,
            avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=cristof',
        },
        {
            id: 'w4',
            name: 'sonic',
            amount: 150,
            avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=lucas',
        },
        {
            id: 'w5',
            name: 'mario',
            amount: 150,
            avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=lucas',
        },

    ];

    const LOOPS = 3;
    const loopedWinners = Array.from({ length: LOOPS }).flatMap((_, loopIdx) =>
        winners.map((w, baseIdx) => ({ ...w, _key: `${w.id}-${loopIdx}-${baseIdx}` }))
    );

    // start from the middle copy for infinite effect
    useEffect(() => {
        if (winners.length > 0) {
            setCurrentIndex(winners.length);
        }
    }, []);

    // auto-advance driven by external tick for sync with Home.js
    useEffect(() => {
        if (tick === 0) return;
        setCurrentIndex((prev) => {
            const next = prev + 1;
            const endOfMiddle = winners.length * 2;
            if (next >= endOfMiddle) {
                isResettingRef.current = true;
                return winners.length;
            }
            return next;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tick]);

    // scroll only the list to center the active winner (avoid page scroll)
    useEffect(() => {
        const listEl = listRef.current;
        const activeItem = itemRefs.current[currentIndex];
        if (!listEl || !activeItem) return;

        const listHeight = listEl.clientHeight;
        const itemHeight = activeItem.offsetHeight;
        const targetTop = activeItem.offsetTop - (listHeight / 2 - itemHeight / 2);
        const clampedTarget = Math.max(0, targetTop);

        // cancel any in-flight animation
        if (scrollAnimRef.current) {
            cancelAnimationFrame(scrollAnimRef.current);
            scrollAnimRef.current = null;
        }

        // On loop reset, jump instantly to avoid visible rewind
        if (isResettingRef.current) {
            listEl.scrollTop = clampedTarget;
            isResettingRef.current = false;
            return;
        }

        // Smooth, eased scrolling to the target position
        const start = listEl.scrollTop;
        const change = clampedTarget - start;
        const duration = Math.min(800, Math.max(450, Math.abs(change))); // adapt duration a bit to distance
        const startTime = performance.now();

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            const eased = easeOutCubic(progress);
            listEl.scrollTop = start + change * eased;
            if (progress < 1) {
                scrollAnimRef.current = requestAnimationFrame(step);
            } else {
                scrollAnimRef.current = null;
            }
        };

        scrollAnimRef.current = requestAnimationFrame(step);
    }, [currentIndex]);

    // notify parent about the active winner name
    useEffect(() => {
        if (!onActiveChange || winners.length === 0) return;
        const baseIndex = currentIndex % winners.length;
        const activeName = winners[baseIndex]?.name;
        if (activeName) onActiveChange(activeName);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]);

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-2xl p-6 border border-gray-700 bg-black/40 shadow-xl overflow-hidden transition-transform duration-200 "
            style={{ transformStyle: 'preserve-3d', willChange: 'transform', '--x': '50%', '--y': '50%' }}
        >
            {/* subtle grid background */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
            />

            {/* cursor highlight */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background: 'radial-gradient(600px circle at var(--x) var(--y), rgba(255,255,255,0.08), transparent 40%)',
                }}
            />

            {/* Header */}
            <div className="relative flex items-center gap-3 mb-4 justify-center transform" style={{ transformStyle: 'preserve-3d', willChange: 'transform', '--x': '50%', '--y': '50%' }}>
                <span className="inline-block h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(255,100,0,0.7)]" />
                <h3 className="text-2xl font-extrabold tracking-wide text-orange-500 text-center">GAME</h3>
                <span className="inline-block h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(255,100,0,0.7)]" />
            </div>

            {/* List - auto scrolls and centers active item */}
            <ul
                ref={listRef}
                className="relative divide-y divide-white/10 max-h-[240px] overflow-y-auto overscroll-contain pr-2 nice-scroll snap-y scrollbar-hide"
            >
                {loopedWinners.map((w, idx) => (
                    <li
                        key={w._key}
                        ref={(el) => (itemRefs.current[idx] = el)}
                        className={
                            `flex items-center justify-between py-4 p-2 transition-all duration-500 ease-out` +
                            (idx === currentIndex
                                ? ' bg-white/5 scale-[1.02] ring-1 ring-white/10 shadow-lg'
                                : ' opacity-80')
                        }
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={w.avatar}
                                alt={w.name}
                                className={
                                    `h-12 w-12 rounded-full ring-2 ring-white/10 bg-gray-800 transition-transform duration-500` +
                                    (idx === currentIndex ? ' scale-110' : '')
                                }
                                loading="lazy"
                            />
                            <p className={
                                `text-white font-semibold text-lg transition-colors duration-500` +
                                (idx === currentIndex ? ' text-orange-200' : ' text-white/90')
                            }>{w.name}</p>
                        </div>
                        <p className={
                            `font-bold transition-colors duration-500` +
                            (idx === currentIndex ? ' text-green-300' : ' text-green-400/80')
                        }>+${w.amount}</p>
                    </li>
                ))}
            </ul>

            {/* local keyframes for the progress bar */}
            <style>{`
                @keyframes progressFill {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }

                /* Nicer scrollbar for WebKit */
                .nice-scroll::-webkit-scrollbar { width: 8px; }
                .nice-scroll::-webkit-scrollbar-track { background: transparent; }
                .nice-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.14);
                    border-radius: 9999px;
                }
                .nice-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.24); }
            `}</style>
        </div>
    );
}


