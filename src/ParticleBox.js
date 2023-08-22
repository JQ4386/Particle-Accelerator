import React, { useState, useEffect } from "react";

import Explosion from "./Explosion";


export default function ParticleBox({ money, setMoney, refreshRate, wallValue, particleSpeed }) {
    const boxSize = 300;
    const particleSize = 15;
    const [position, setPosition] = useState({ x: boxSize / 2, y: boxSize / 2 }); // initialize in center of box
    const [velocity, setVelocity] = useState({ x: 2, y: 3 });

    // Explosion states
    const [explosions, setExplosions] = useState([]);

    // Parse particleSpeed from integer to Object
    useEffect(() => {
        setVelocity(prevVelocity => ({
            x: particleSpeed * 2/5 * Math.sign(prevVelocity.x), 
            y: particleSpeed * 3/5 * Math.sign(prevVelocity.y)}) )
        console.log(particleSpeed)
      }, [particleSpeed]);


    useEffect(() => {
        const interval = setInterval(() => {
            let newX = position.x + velocity.x;
            let newY = position.y + velocity.y;

            const collisionX = newX < 0 || newX + particleSize >= boxSize;
            const collisionY = newY < 0 || newY + particleSize >= boxSize;

            if (collisionX || collisionY) {
                /// Adjust for right and bottom wall collision
                let explosionX = collisionX ? (newX + particleSize >= boxSize ? newX + particleSize : newX) : newX;
                let explosionY = collisionY ? (newY + particleSize >= boxSize ? newY + particleSize : newY) : newY;

                const newExplosion = {
                    x: explosionX,
                    y: explosionY,
                    id: Date.now()
                };

                setExplosions(prev => [...prev, newExplosion]);
                setMoney(prevMoney => prevMoney + wallValue);
            }

            // Bounce off the walls
            if (newX < 0 || newX + particleSize >= boxSize) {
                setVelocity(prevVelocity => {
                    return { ...prevVelocity, x: -prevVelocity.x };
                });
            }

            if (newY < 0 || newY + particleSize >= boxSize) {
                setVelocity(prevVelocity => {
                    return { ...prevVelocity, y: -prevVelocity.y };
                });
            }

            setPosition({ x: newX, y: newY });
        }, 1000 / refreshRate); // once every frame

        return () => clearInterval(interval); // cleanup
    }, [position, velocity, setMoney, explosions, refreshRate, wallValue]);

    return (
        <div className="particle-box" style={{
            width: boxSize,
            height: boxSize,
            border: '10px solid white',
            position: 'relative'
        }}>

            {explosions.map(explosion =>
                <Explosion
                    key={explosion.id}
                    size={100}
                    color={"red"}
                    refreshRate = {refreshRate}
                    position={explosion}
                    onComplete={() => {
                        setExplosions(prev => prev.filter(e => e.id !== explosion.id));
                    }}
                />
            )}
            <div className="particle" style={{
                width: particleSize,
                height: particleSize,
                backgroundColor: 'red',
                position: 'absolute',
                left: position.x,
                top: position.y
            }}></div>
        </div>
    );
}

