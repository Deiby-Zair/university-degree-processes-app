import React from "react";

interface SegmentedBarProps {
    segments: number;
    colors: string[]
}

const SegmentedBar: React.FC<SegmentedBarProps> = ({ segments, colors }) => {
    const segmentWidth = 100 / segments;

    return (
        <div className="flex w-full">
            {Array.from({ length: segments }).map((_, index) => (
                <div
                    key={index}
                    className={`${colors[index % colors.length]} h-3 rounded-lg m-0.5`}
                    style={{ width: `${segmentWidth}%` }}
                />
            ))}
        </div>
    );
};

export default SegmentedBar;
