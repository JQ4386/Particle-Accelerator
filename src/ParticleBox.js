import React, { useState } from "react";
import { nanoid } from "nanoid";

import Explosion from "./Explosion";
import Particle from "./Particle";


export default function ParticleBox({ setMoney, refreshRate, wallValue, particleSpeed, particleData, boxSize, particleSize }) {


    // Explosion states
    const [explosions, setExplosions] = useState([]);

    function handleCollision(collisionPosition) {
        const newExplosion = {
            x: collisionPosition.x,
            y: collisionPosition.y,
            id: nanoid()
        };

        setExplosions(prev => [...prev, newExplosion]);
        setMoney(prevMoney => prevMoney + wallValue);
    }


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
                    refreshRate={refreshRate}
                    position={explosion}
                    onComplete={() => {
                        setExplosions(prev => prev.filter(e => e.id !== explosion.id));
                    }}
                />
            )}
            <div>
                {particleData.map(particle =>
                    <Particle
                        key={particle.id}
                        initPosition={particle.position}
                        initVelocity={particle.velocity}
                        onCollision={handleCollision}
                        boxSize={boxSize}
                        particleSize={particleSize}
                        refreshRate={refreshRate}
                        particleSpeed={particleSpeed}
                    />
                )}
            </div>
        </div>
    );
}

