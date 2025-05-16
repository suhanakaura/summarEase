import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const RatingInput = ({ label, value, onChange }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="cursor-pointer">
                        <input
                            type="radio"
                            name="userExperienceRating"
                            value={rating}
                            checked={value === rating}
                            onChange={() => onChange(rating)}
                            className="hidden"
                        />
                        <span
                            className={`text-2xl ${
                                value >= rating ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                        >
                            <FontAwesomeIcon icon={faStar} />
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default RatingInput;