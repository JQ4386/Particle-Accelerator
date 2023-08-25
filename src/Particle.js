import React, { useEffect } from 'react';

export default function Particle({ initPosition, initVelocity, onCollision, particleSize, boxSize, refreshRate }) {
    const [position, setPosition] = React.useState(initPosition);
    const [velocity, setVelocity] = React.useState(initVelocity);

    useEffect(() => {
        const interval = setInterval(() => {
            let newX = position.x + velocity.x;
            let newY = position.y + velocity.y;

            if (newX < 0 || newX + particleSize >= boxSize) {
                setVelocity(prevVelocity => ({ ...prevVelocity, x: -prevVelocity.x }));
                onCollision({ x: newX, y: newY });
            }

            if (newY < 0 || newY + particleSize >= boxSize) {
                setVelocity(prevVelocity => ({ ...prevVelocity, y: -prevVelocity.y }));
                onCollision({ x: newX, y: newY });
            }

            setPosition({ x: newX, y: newY });
        }, 1000/refreshRate);

        return () => clearInterval(interval);
    }, [position, velocity, onCollision, boxSize, particleSize, refreshRate]);

    return (
        <div className="particle" style={{
            width: particleSize,
            height: particleSize,
            backgroundColor: 'white',
            borderRadius: '50%',
            position: 'absolute',
            left: position.x,
            top: position.y
        }}></div>
    );
}



