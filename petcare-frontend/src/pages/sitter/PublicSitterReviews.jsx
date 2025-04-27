import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PublicSitterReviews = () => {
  const { sitterId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [sitter, setSitter] = useState(null);
  const [sitterProfile, setSitterProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('You must be logged in to view reviews');
          setLoading(false);
          return;
        }

        // Fetch sitter information
        const userResponse = await axios.get(`http://localhost:5000/api/User/GetById/${sitterId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (userResponse.data && userResponse.data.response) {
          setSitter(userResponse.data.response);
        }
        
        // Fetch sitter profile
        const profileResponse = await axios.get(`http://localhost:5000/api/SitterProfile/Get/${sitterId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (profileResponse.data && profileResponse.data.response) {
          setSitterProfile(profileResponse.data.response);
        }

        // Fetch reviews
        const reviewsResponse = await axios.get(`http://localhost:5000/api/Review/GetForSitter/${sitterId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (reviewsResponse.data && reviewsResponse.data.response) {
          const reviewData = reviewsResponse.data.response;
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
        console.error('Error fetching data:', err);
        setError('Failed to load sitter reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (sitterId) {
      fetchData();
    }
  }, [sitterId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {sitter && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-xl font-bold text-white">Reviews for {sitter.name}</h1>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex items-center mb-4 md:mb-0 mr-0 md:mr-8">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                  {sitter.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">{sitter.name}</h2>
                  {sitterProfile && <p className="text-gray-600">{sitterProfile.location}</p>}
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-center">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{averageRating}</span>
                  <span className="ml-1 text-lg text-gray-600">/ 5</span>
                </div>
                <div className="flex text-xl text-yellow-500 mt-1">
                  {renderStars(Math.round(averageRating))}
                </div>
                <p className="text-gray-600 mt-1">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
              </div>
              
              {sitterProfile && (
                <div className="mt-4 md:mt-0 md:ml-auto">
                  <Link 
                    to={`/sitters`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Book {sitter.name}
                  </Link>
                </div>
              )}
            </div>
            
            {sitterProfile && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">About {sitter.name}</h3>
                <p className="text-gray-700">{sitterProfile.bio}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Experience</h4>
                    <p className="mt-1 text-gray-900">{sitterProfile.yearsExperience} years</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Rate</h4>
                    <p className="mt-1 text-gray-900">${sitterProfile.hourlyRate}/hour</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800">All Reviews</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {reviews.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No reviews yet for this sitter.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="mr-4">{renderStars(review.rating)}</div>
                    <div className="font-medium text-gray-900">{review.reviewerName}</div>
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(review.date)}</div>
                </div>
                <div className="mt-2">
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicSitterReviews;