import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ThankYou = () => {
    const location = useLocation();
    const { feedback } = location.state || { feedback: [] };
    const [previousFeedback, setPreviousFeedback] = useState([]);

    useEffect(() => {
        const storedFeedback = JSON.parse(localStorage.getItem('feedbackList')) || [];
        setPreviousFeedback(storedFeedback);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center  font-serif p-8">
            <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Thank You!</h2>
                <p className="text-center text-green-500 mb-4">Your feedback has been submitted successfully!</p>
                <h3 className="text-xl font-semibold mt-6 text-gray-800">Submitted Feedback</h3>
                <ul className="mt-2">
                    {feedback.map((item, index) => (
                        <li key={index} className="border-b border-gray-200 py-2 text-black">
                            <strong>{item.name} ({item.email}):</strong> {item.message}
                        </li>
                    ))}
                </ul>
                <h3 className="text-xl font-semibold mt-6 text-gray-800">Previous Feedbacks</h3>
                <ul className="mt-2">
                    {previousFeedback.map((item, index) => (
                        <li key={index} className="border-b border-gray-200 py-2 text-black">
                            <strong>{item.name} ({item.email}):</strong> {item.message}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ThankYou;