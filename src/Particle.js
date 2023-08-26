import React from 'react';

export default function Particle({ position, particleSize, color }) {

    // dumb component that just renders a particle
    return (
        <div className="particle" style={{
            width: particleSize,
            height: particleSize,
            backgroundColor: color,
            borderRadius: '50%',
            position: 'absolute',
            left: position.x,
            top: position.y
        }}></div>
    );
}



