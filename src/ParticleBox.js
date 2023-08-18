import React, { useState, useEffect } from "react";

import Explosion from "./Explosion";


export default function ParticleBox({ money, setMoney, refreshRate }) {
    const boxSize = 300;
    const particleSize = 15;
    const [position, setPosition] = useState({ x: boxSize / 2, y: boxSize / 2 }); // initialize in center of box
    const [velocity, setVelocity] = useState({ x: 4, y: 6 });

    // Explosion states
    const [explosions, setExplosions] = useState([]);


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

                console.log(explosions)
                setMoney(prevMoney => prevMoney + 1);
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
    }, [position, velocity, setMoney, refreshRate]);

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
                    color={"white"}
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

