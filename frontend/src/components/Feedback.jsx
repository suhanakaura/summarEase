import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RatingInput from './RatingInput';

const Feedback = () => {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        usageFrequency: '',
        userExperienceRating: null,
        message: '',
    });
    const [feedbackList, setFeedbackList] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedFeedback = JSON.parse(localStorage.getItem('feedbackList')) || [];
        setFeedbackList(storedFeedback);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (field) => (value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.usageFrequency || !formData.message) {
            setError('All fields are required.');
            return;
        }

        const updatedFeedbackList = [...feedbackList, formData];
        setFeedbackList(updatedFeedbackList);

        localStorage.setItem('feedbackList', JSON.stringify(updatedFeedbackList));
        alert("Feedback submitted successfully!")
        navigate('/thankyou', { state: { feedback: [formData] } });

        setFormData({
            name: '',
            email: '',
            usageFrequency: '',
            userExperienceRating: null,
            message: '',
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center  font-serif p-8 pt-24">
            <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">SummarEase Feedback</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200 text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200 text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">How often do you use SummarEase?</label>
                        <select
                            value={formData.usageFrequency}
                            onChange={(e) => handleSelectChange('usageFrequency')(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200 text-black"
                            required
                        >
                            <option value="" disabled>Select usage frequency</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Several times a week</option>
                            <option value="monthly">A few times a month</option>
                            <option value="rarely">Rarely</option>
                        </select>
                    </div>
                    <RatingInput
                        label="How would you rate your overall experience with our app?"
                        value={formData.userExperienceRating}
                        onChange={handleSelectChange("userExperienceRating")}
                    />
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Your Feedback</label>
                        <textarea
                            name="message"
                            placeholder="Please provide your detailed feedback, suggestions, or report issues here"
                            value={formData.message}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200 text-black"
                            rows={5}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#4f6498] text-white font-semibold py-3 rounded-md hover:bg-[#3b4a7a] transition duration-200"
                    >
                        Submit Feedback
                    </button>
                </form>
                {/* Uncomment to display previous feedbacks */}
                {/* <h3 className="text-xl font-semibold mt-6 text-gray-800">Previous Feedbacks</h3>
                <ul className="mt-2">
                    {feedbackList.map((feedback, index) => (
                        <li key={index} className="border-b border-gray-200 py-2">
                            <strong>{feedback.name} ({feedback.email}):</strong> {feedback.message}
                        </li>
                    ))}
                </ul> */}
            </div>
        </div>
    );
};

export default Feedback;