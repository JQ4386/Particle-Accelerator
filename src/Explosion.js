import React, { useRef, useEffect } from "react";
import gsap, { Power4 } from "gsap";

export default function Explosion({ size, onComplete = () => {}, style, color, position }) {
    const circleRef = useRef(null);
    const center = size / 2;
    const strokeWidth = Math.ceil(size * 2 / 100);

    useEffect(() => {
        const timeline = gsap.timeline({
            onComplete: () => {
                onComplete(); // this will notify ParticleBox that the animation is complete
            }
        });

        timeline
            .fromTo(
                circleRef.current,
                { scale: 0, transformOrigin: "center" },
                { scale: 1, ease: Power4.easeOut, duration: 1 }
            )
            .fromTo(
                circleRef.current,
                { attr: { "stroke-width": strokeWidth, opacity: 1 }, ease: Power4.easeOut },
                { attr: { "stroke-width": 0, opacity: 0 }, ease: Power4.easeOut, duration: 0.8 },
                "-=0.5"
            );

        return () => timeline.kill();
    }, []);

    return (
        <svg
            width={size}
            height={size}
            style={{ ...style, position: "absolute", left: `${position.x - (size / 2)}px`, 
            top: `${position.y - (size / 2)}px`  }}
        >
            <circle
                cx={center}
                cy={center}
                r="47%"
                strokeWidth={strokeWidth}
                stroke={color}
                fill="none"
                ref={circleRef}
            />
        </svg>
    );
}