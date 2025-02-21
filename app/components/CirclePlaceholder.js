import React, { useState, useEffect } from 'react';

const CirclePlaceholder = () => {
    const [paths, setPaths] = useState([]);

    useEffect(() => {
        const segments = [
            { percentage: 35, color: '#3b82f6', label: 'Excellent' },
            { percentage: 30, color: '#10b981', label: 'Good' },
            { percentage: 20, color: '#f59e0b', label: 'Average' },
            { percentage: 15, color: '#ef4444', label: 'Needs Work' }
        ];

        const generatePieSegment = (startPercent, endPercent) => {
            const start = startPercent * 3.6;
            const end = endPercent * 3.6;

            const startAngle = (start - 90) * (Math.PI / 180);
            const endAngle = (end - 90) * (Math.PI / 180);

            const startX = Math.cos(startAngle) * 100;
            const startY = Math.sin(startAngle) * 100;
            const endX = Math.cos(endAngle) * 100;
            const endY = Math.sin(endAngle) * 100;

            const largeArcFlag = end - start > 180 ? 1 : 0;

            return `M 0 0 L ${startX} ${startY} A 100 100 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
        };

        let currentPercent = 0;
        const newPaths = segments.map((segment) => {
            const path = generatePieSegment(currentPercent, currentPercent + segment.percentage);
            currentPercent += segment.percentage;
            return { path, color: segment.color };
        });

        setPaths(newPaths);
    }, []);

    return (
        <div className="max-w-md mx-auto aspect-square mt-8">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 p-8">
                <div className="relative">
                    <svg viewBox="-100 -100 200 200" className="w-full transform -rotate-90">
                        {paths.map((segment, index) => (
                            <path
                                key={index}
                                d={segment.path}
                                fill={segment.color}
                                className="transition-all duration-300 hover:opacity-80"
                            />
                        ))}
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default CirclePlaceholder;
