import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';

const SitterReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !token) {
          setError('You must be logged in to view reviews');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/Review/GetForSitter/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.response) {
          const reviewData = response.data.response;
          setReviews(reviewData);
          
          // Calculate average rating
          if (reviewData.length > 0) {
            const total = reviewData.reduce((sum, review) => sum + review.rating, 0);
            setAverageRating((total / reviewData.length).toFixed(1));
          }
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-500" : "text-gray-300"}>★</span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const columns = [
    {
      key: 'rating',
      header: 'Rating',
      render: (review) => renderStars(review.rating)
    },
    {
      key: 'reviewerName',
      header: 'From',
    },
    {
      key: 'comment',
      header: 'Comment',
    },
    {
      key: 'date',
      header: 'Date',
      render: (review) => formatDate(review.date)
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Reviews</h1>
        {reviews.length > 0 && (
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <div className="text-lg font-medium mr-2">Average Rating:</div>
            <div className="text-xl font-bold text-yellow-500">{averageRating}</div>
            <div className="ml-2">{renderStars(Math.round(averageRating))}</div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">You don't have any reviews yet.</p>
          <p className="text-gray-500 mt-2">Complete bookings to receive reviews from clients.</p>
        </div>
      ) : (
        <DataTable
          title="Review History"
          columns={columns}
          data={reviews}
          itemsPerPage={10}
        />
      )}
    </div>
  );
};

export default SitterReviews;