import  { useState, useEffect } from "react";

const FormUpload = () => {
    const [animateLines, setAnimateLines] = useState(false);
    const [showTick, setShowTick] = useState(false);

    useEffect(() => {
        const lineTimer = setTimeout(() => {
            setAnimateLines(true);
        }, 500); // Delay before starting line animation

        const tickTimer = setTimeout(() => {
            setShowTick(true);
        }, 2000); // Show tick after 2 seconds

        return () => {
            clearTimeout(lineTimer);
            clearTimeout(tickTimer);
        };
    }, []);

    return (
        <div className="flex items-center justify-center  bg-background">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                className="w-32 h-32"
            >
                {/* Background Rect */}
                <rect
                    x="20"
                    y="20"
                    width="60"
                    height="80"
                    rx="10"
                    className="fill-primary"
                />
                {/* Animated Lines */}
                <line
                    x1="30"
                    y1="40"
                    x2="70"
                    y2="40"
                    className={`stroke-white transition-all duration-700 ${animateLines ? "stroke-[4]" : "stroke-[2]"
                        }`}
                />
                <line
                    x1="30"
                    y1="50"
                    x2="70"
                    y2="50"
                    className={`stroke-white transition-all duration-700 delay-150 ${animateLines ? "stroke-[4]" : "stroke-[2]"
                        }`}
                />
                <line
                    x1="30"
                    y1="60"
                    x2="55"
                    y2="60"
                    className={`stroke-white transition-all duration-700 delay-300 ${animateLines ? "stroke-[4]" : "stroke-[2]"
                        }`}
                />
                <line
                    x1="30"
                    y1="70"
                    x2="70"
                    y2="70"
                    className={`stroke-white transition-all duration-700 delay-450 ${animateLines ? "stroke-[4]" : "stroke-[2]"
                        }`}
                />
                {/* Tick Circle */}
                <circle
                    cx="70"
                    cy="30"
                    r="15"
                    className={`fill-primary/50 transition-opacity duration-500 ${showTick ? "opacity-100" : "opacity-0"
                        }`}
                />
                <path
                    d="M65 30 l5 5 l10 -10"
                    className={`stroke-white stroke-[3] fill-none transition-opacity duration-500 ${showTick ? "opacity-100" : "opacity-0"
                        }`}
                />
            </svg>
        </div>
    );
};

export default FormUpload;
