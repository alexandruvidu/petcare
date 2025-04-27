import React, { useState } from 'react';
import axios from 'axios';
import ReviewForm from '../ReviewForm';

const BookingDetailModal = ({ booking, onClose, onEdit, onDelete, userRole }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  if (!booking) return null;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDuration = () => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    
    // Calculate difference in milliseconds
    const diffTime = Math.abs(end - start);
    
    // Convert to days, hours, minutes
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    // Format the duration string
    let durationString = '';
    if (diffDays > 0) {
      durationString += `${diffDays} day${diffDays > 1 ? 's' : ''} `;
    }
    if (diffHours > 0 || diffDays > 0) {
      durationString += `${diffHours} hour${diffHours > 1 ? 's' : ''} `;
    }
    durationString += `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    
    return durationString;
  };

  const handleSubmitReview = async (reviewData, existingReviewId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (existingReviewId) {
        // Update existing review
        await axios.put(`http://localhost:5000/api/Review/Update/${existingReviewId}`, {
          rating: reviewData.rating,
          comment: reviewData.comment
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Add new review
        await axios.post('http://localhost:5000/api/Review/Add', reviewData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      setReviewSuccess(true);
      setShowReviewForm(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Booking Details</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {/* Booking Status */}
          <div className="mb-4 flex justify-between items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(booking.status)}`}>
              {booking.status}
            </span>
            <div className="text-sm text-gray-500">
              ID: {booking.id.substring(0, 8)}...
            </div>
          </div>
          
          {/* Pet and People Information */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pet</h4>
              <p className="mt-1 text-gray-900 font-medium">{booking.petName || 'Not specified'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {userRole === 'Client' ? 'Sitter' : 'Client'}
              </h4>
              <p className="mt-1 text-gray-900 font-medium">
                {userRole === 'Client' ? booking.sitterName : booking.clientName}
              </p>
            </div>
          </div>
          
          {/* Date and Time Information */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Schedule</h4>
            
            <div className="bg-gray-50 rounded-md p-3 space-y-2">
              <div>
                <span className="text-gray-600">Start:</span>
                <span className="ml-2 text-gray-900">{formatDateTime(booking.startDate)}</span>
              </div>
              
              <div>
                <span className="text-gray-600">End:</span>
                <span className="ml-2 text-gray-900">{formatDateTime(booking.endDate)}</span>
              </div>
              
              <div>
                <span className="text-gray-600">Duration:</span>
                <span className="ml-2 text-gray-900">{getDuration()}</span>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Notes</h4>
            <div className="bg-gray-50 rounded-md p-3 min-h-16">
              {booking.notes ? (
                <p className="text-gray-900">{booking.notes}</p>
              ) : (
                <p className="text-gray-500 italic">No notes provided</p>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            {userRole === 'Client' && booking.status === 'Completed' && !showReviewForm && !reviewSuccess && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-4 py-2 border border-yellow-300 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                Leave Review
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(booking);
                  onClose();
                }}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            )}
            
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(booking);
                  onClose();
                }}
                className="px-4 py-2 border border-blue-300 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
          
          {/* Review Success Message */}
          {reviewSuccess && (
            <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md">
              Your review has been submitted successfully!
            </div>
          )}
          
          {/* Review Error Message */}
          {reviewError && (
            <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md">
              {reviewError}
            </div>
          )}
          
          {/* Review Form */}
          {showReviewForm && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                {reviewSuccess ? 'Update Your Review' : 'Leave a Review'}
              </h4>
              <ReviewForm
                booking={booking}
                onSubmit={handleSubmitReview}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;