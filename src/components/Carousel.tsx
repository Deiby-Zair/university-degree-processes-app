import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

const Carousel: React.FC<{ items: (string | any)[]; }> = ({ items }) => {

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? items.length - 1 : prevIndex - 1
        );
    };

    const selectButtons =
        <div className="flex justify-between items-center w-full p-2">
            <button onClick={handlePrevious} className="mr-24 p-2 hover:text-blue-600">
                <ChevronLeft />
            </button>
            <span className='text-sm'>{`${currentIndex + 1} / ${items.length}`}</span>
            <button onClick={handleNext} className="ml-24 p-2 hover:text-blue-600">
                <ChevronRight />
            </button>
        </div>

    return (
        <div className="flex flex-col justify-center items-center 
      bg-white rounded-lg shadow-lg text-center p-4 my-4">
            <div>
                {selectButtons}
                {items[currentIndex].options}
            </div>
            <div className="text-center">
                {items[currentIndex].content}
            </div>
            <div>
                {items[currentIndex].options}
                {selectButtons}
            </div>
        </div>
    );
};

export default Carousel;
