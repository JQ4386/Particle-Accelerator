import React, { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";

import Explosion from "./Explosion";
import Particle from "./Particle";


export default function ParticleBox({ setMoney, refreshRate, wallValue, particleSpeed, particleData, handleParticlesUpdate, boxSize, particleSize, getRandomColor }) {

    const [interpParticles, setInterpParticles] = useState(new Map());

    // Handle particle collisions
    useEffect(() => {
        // Partition the box into grid squares to avoid O(n^2) collision detection, n = number of particles
        function partitionBox(particles, partitionSize = particleSize + 5) {
            let grid = {};

            particles.forEach(particle => {
                let cellX = Math.floor(particle.position.x / partitionSize);
                let cellY = Math.floor(particle.position.y / partitionSize);

                let key = `${cellX},${cellY}`;
                if (!grid[key]) grid[key] = [];
                grid[key].push(particle);
            });

            return grid;
        }

        function checkCollision(particleA, particleB) {
            let dx = particleA.position.x - particleB.position.x;
            let dy = particleA.position.y - particleB.position.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            return distance < particleSize;
        }

        function resolveCollision(particleA, particleB) {
            // Difference in positions
            const dx = particleB.position.x - particleA.position.x;
            const dy = particleB.position.y - particleA.position.y;

            // Distance between the centers of the two balls
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate angle of approach
            const angle = Math.atan2(dy, dx);

            // Calculate velocities in rotated frame
            const rotatedVelocityA = {
                x: particleA.velocity.x * Math.cos(angle) + particleA.velocity.y * Math.sin(angle),
                y: particleA.velocity.y * Math.cos(angle) - particleA.velocity.x * Math.sin(angle)
            };

            const rotatedVelocityB = {
                x: particleB.velocity.x * Math.cos(angle) + particleB.velocity.y * Math.sin(angle),
                y: particleB.velocity.y * Math.cos(angle) - particleB.velocity.x * Math.sin(angle)
            };

            // Swap x-components of rotated velocities
            const temp = rotatedVelocityA.x;
            rotatedVelocityA.x = rotatedVelocityB.x;
            rotatedVelocityB.x = temp;

            // Convert back from rotated frame
            particleA.velocity = {
                x: particleSpeed * Math.cos(angle + Math.PI),
                y: particleSpeed * Math.sin(angle + Math.PI)
            };

            particleB.velocity = {
                x: particleSpeed * Math.cos(angle),
                y: particleSpeed * Math.sin(angle)
            };

            // Correct particle positions to prevent sticking
            // Overlap between the two particles
            const overlap = 1 * particleSize - distance;

            // Half overlap for each particle
            const separation = overlap / 2;

            const separationVectorA = {
                x: -separation * Math.cos(angle),
                y: -separation * Math.sin(angle)
            };

            const separationVectorB = {
                x: separation * Math.cos(angle),
                y: separation * Math.sin(angle)
            };

            setInterpParticles(prev => new Map([...prev, [particleA.id, separationVectorA], [particleB.id, separationVectorB]]));
        }

        function handleParticleCollisions(particles, grid, partitionSize = 20) {
            let updatedParticles = [...particles];
            let checkedPairs = new Set();  // Set of particle pairs that have already been checked
            let collisions = [];  // Store collisions for batch processing


            updatedParticles.forEach(particle => {
                let cellX = Math.floor(particle.position.x / partitionSize);
                let cellY = Math.floor(particle.position.y / partitionSize);

                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        let neighboringCellX = cellX + i;
                        let neighboringCellY = cellY + j;

                        let key = `${neighboringCellX},${neighboringCellY}`;
                        let neighboringParticles = grid[key] || [];

                        neighboringParticles.forEach(neighbor => {
                            // Check if we've already checked this pair
                            const minId = Math.min(particle.id, neighbor.id);
                            const maxId = Math.max(particle.id, neighbor.id);
                            const pairId = `${minId}-${maxId}`;

                            if (neighbor !== particle && !checkedPairs.has(pairId)) {  // <-- Modify the if condition
                                checkedPairs.add(pairId);  // <-- 

                                if (neighbor !== particle && checkCollision(particle, neighbor)) {
                                    // Handle the collision
                                    collisions.push([particle, neighbor]);
                                }
                            }
                        });
                    }
                }
            });
            if (collisions.length === 0) return updatedParticles;

            var collisionCount = 0;
            collisions.forEach(([particleA, particleB]) => {
                resolveCollision(particleA, particleB);
                collisionCount++;
            });
            console.log(`Collisions: ${collisionCount} Resolved!`)
            collisionCount = 0;
            return updatedParticles;
        }

        function areParticlesEqual(particlesA, particlesB) {
            if (particlesA.length !== particlesB.length) return false;

            for (let i = 0; i < particlesA.length; i++) {
                let pA = particlesA[i];
                let pB = particlesB[i];

                if (pA.id !== pB.id ||
                    pA.position.x !== pB.position.x ||
                    pA.position.y !== pB.position.y ||
                    pA.velocity.x !== pB.velocity.x ||
                    pA.velocity.y !== pB.velocity.y) {
                    return false;
                }
            }

            return true;
        }

        const grid = partitionBox(particleData);
        const updatedParticles = handleParticleCollisions(particleData, grid);

        if (!areParticlesEqual(updatedParticles, particleData)) {
            handleParticlesUpdate(updatedParticles);
        }
    }, [particleData, boxSize, particleSize, particleSpeed, handleParticlesUpdate]);

    // Handle particle movement and wall collisions
    const lastUpdateRef = useRef(Date.now()); // Store the last time the particles were updated

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const deltaTime = (now - lastUpdateRef.current) / 1000; // gives time in seconds
            lastUpdateRef.current = now;

            const updatedParticles = particleData.map(particle => {
                let newX = particle.position.x + particle.velocity.x * deltaTime * 20;
                let newY = particle.position.y + particle.velocity.y * deltaTime * 20;
                let newVelocity = { ...particle.velocity };

                const interp = interpParticles.get(particle.id);

                if (interp) {
                    newX += interp.x;
                    newY += interp.y;

                    // Reduce the required interpolation distance for the next iteration
                    interp.x *= 0.25;
                    interp.y *= 0.25;

                    // Remove the particle from interpParticles if it's close enough
                    if (Math.abs(interp.x) < 0.1 && Math.abs(interp.y) < 0.1) {
                        interpParticles.delete(particle.id);
                    }
                }

                function handleCollision(collisionPosition, collisionColor) {
                    const newExplosion = {
                        x: collisionPosition.x,
                        y: collisionPosition.y,
                        id: nanoid(),
                        color: collisionColor
                    };

                    setExplosions(prev => [...prev, newExplosion]);
                    setMoney(prevMoney => prevMoney + wallValue);
                }

                if (newX < 0 || newX + particleSize >= boxSize) {
                    newVelocity.x = -newVelocity.x;

                    // Adjustment to prevent lodging into the wall
                    if (newX < 0) {
                        newX = 0;
                    } else {
                        newX = boxSize - particleSize;
                    }

                    handleCollision(particle.position, particle.color);
                }

                if (newY < 0 || newY + particleSize >= boxSize) {
                    newVelocity.y = -newVelocity.y;

                    // Adjustment to prevent lodging into the wall
                    if (newY < 0) {
                        newY = 0;
                    } else {
                        newY = boxSize - particleSize;
                    }


                    handleCollision(particle.position, particle.color);
                }

                return {
                    ...particle,
                    position: { x: newX, y: newY },
                    velocity: newVelocity
                };
            });

            handleParticlesUpdate(updatedParticles);
        }, 1000 / refreshRate);

        return () => clearInterval(interval);
    }, [particleData, refreshRate, interpParticles, boxSize, handleParticlesUpdate, particleSize, setMoney, wallValue, getRandomColor]);

    // Explosion State 
    const [explosions, setExplosions] = useState([]);


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
                    color={explosion.color}
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
                        position={particle.position}
                        velocity={particle.velocity}
                        particleSize={particleSize}
                        boxSize={boxSize}
                        color={particle.color}
                    />
                )}
            </div>
        </div>
    );
}

