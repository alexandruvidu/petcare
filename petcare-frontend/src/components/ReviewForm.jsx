import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewForm = ({ booking, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    sitterId: booking?.sitterId || '',
    bookingId: booking?.id || ''
  });
  
  const [errors, setErrors] = useState({});
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkExistingReview = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Check if there's an existing review for this booking
        const response = await axios.get(`http://localhost:5000/api/Review/GetByBooking/${booking.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.response) {
          setExistingReview(response.data.response);
          // Pre-fill the form with existing review data for editing
          setFormData({
            rating: response.data.response.rating,
            comment: response.data.response.comment,
            sitterId: booking.sitterId,
            bookingId: booking.id
          });
        }
      } catch (err) {
        // If 404 or other error, there's no existing review, which is fine
        console.log('No existing review found');
      } finally {
        setLoading(false);
      }
    };

    if (booking && booking.id) {
      checkExistingReview();
    }
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (newRating) => {
    setFormData(prev => ({
      ...prev,
      rating: newRating
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Please select a rating from 1 to 5';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Please provide a comment';
    } else if (formData.comment.length > 1000) {
      newErrors.comment = 'Comment must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData, existingReview?.id);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {existingReview ? 'Update Rating' : 'Rating'}
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className="text-2xl focus:outline-none"
            >
              <span className={star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
            </button>
          ))}
        </div>
        {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating}</p>}
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          {existingReview ? 'Update Comment' : 'Comment'}
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          value={formData.comment}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
            errors.comment ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Share your experience with this pet sitter..."
        ></textarea>
        {errors.comment && <p className="mt-1 text-sm text-red-500">{errors.comment}</p>}
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {existingReview ? 'Update Review' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;