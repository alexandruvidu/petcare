import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SitterDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    activeBookings: 0,
    completedBookings: 0,
    upcomingBookings: 0,
    avgRating: 0,
    reviewCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        setUserData(user);

        // Fetch profile data
        try {
          const profileResponse = await axios.get('http://localhost:5000/api/SitterProfile/MyProfile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (profileResponse.data && profileResponse.data.response) {
            setProfileComplete(true);
          } else {
            setProfileComplete(false);
          }
        } catch (err) {
          setProfileComplete(false);
        }
        
        // Fetch bookings
        const bookingsResponse = await axios.get('http://localhost:5000/api/Booking/GetMyBookings', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch reviews
        try {
          const reviewsResponse = await axios.get(`http://localhost:5000/api/Review/GetForSitter/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (reviewsResponse.data && reviewsResponse.data.response) {
            const reviews = reviewsResponse.data.response;
            let totalRating = 0;
            
            reviews.forEach(review => {
              totalRating += review.rating;
            });
            
            const average = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
            
            setStats(prev => ({ 
              ...prev, 
              avgRating: average,
              reviewCount: reviews.length
            }));
          }
        } catch (err) {
          console.error('Error fetching reviews', err);
        }

        if (bookingsResponse.data && bookingsResponse.data.response) {
          const bookings = bookingsResponse.data.response;
          const today = new Date();
          
          const active = bookings.filter(b => 
            (b.status === 'Accepted' || b.status === 'Pending') && 
            new Date(b.endDate) >= today
          ).length;
          
          const completed = bookings.filter(b => b.status === 'Completed').length;
          
          const upcoming = bookings.filter(b => 
            b.status === 'Accepted' && 
            new Date(b.startDate) > today
          ).length;
          
          setStats(prev => ({ 
            ...prev, 
            activeBookings: active,
            completedBookings: completed,
            upcomingBookings: upcoming
          }));
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const goToProfileTab = () => {
    // Navigate to profile page with a query parameter to open the professional tab
    navigate('/profile?tab=professional');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {userData?.name}</h1>
        <p className="mt-2 text-gray-600">Manage your pet sitting bookings from your dashboard</p>
      </div>

      {!profileComplete && (
        <div className="mb-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Complete Your Profile</h3>
          <p className="text-yellow-700 mb-4">
            Pet owners can't see your profile until you complete your information. Add your bio, experience, and rates to get started.
          </p>
          <button 
            onClick={goToProfileTab}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700"
          >
            Complete Profile
          </button>
        </div>
      )}

      {error && (
        <div className="mb-8 bg-red-50 p-4 rounded-md border border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Bookings</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.activeBookings}</p>
          <div className="mt-4">
            <Link 
              to="/sitter/bookings" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Bookings →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upcoming</h3>
          <p className="text-3xl font-bold text-green-600">{stats.upcomingBookings}</p>
          <div className="mt-4">
            <Link 
              to="/sitter/bookings" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Schedule →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-gray-600">{stats.completedBookings}</p>
          <div className="mt-4">
            <Link 
              to="/sitter/bookings" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View History →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Rating</h3>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-yellow-500">{stats.avgRating}</p>
            <p className="ml-2 text-gray-500">({stats.reviewCount} reviews)</p>
          </div>
          <div className="mt-4">
            <Link 
              to="/sitter/reviews" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Reviews →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/sitter/bookings'} 
            className="bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 text-left"
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 rounded-md p-2 bg-blue-50 text-blue-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              <div className="ml-3">
                <h3 className="text-gray-900 font-medium">Manage Bookings</h3>
                <p className="text-gray-500 text-sm">Accept or reject booking requests</p>
              </div>
            </div>
          </button>

          <button 
            onClick={goToProfileTab} 
            className="bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 text-left"
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 rounded-md p-2 bg-green-50 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <div className="ml-3">
                <h3 className="text-gray-900 font-medium">Update Profile</h3>
                <p className="text-gray-500 text-sm">Edit your bio and availability</p>
              </div>
            </div>
          </button>

          <Link 
            to="/sitter/reviews" 
            className="bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 text-left"
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 rounded-md p-2 bg-yellow-50 text-yellow-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </span>
              <div className="ml-3">
                <h3 className="text-gray-900 font-medium">View Reviews</h3>
                <p className="text-gray-500 text-sm">See feedback from pet owners</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Feedback Card */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-2">We Value Your Feedback</h3>
        <p className="text-blue-600 mb-4">Help us improve your experience by sharing your thoughts.</p>
        <Link 
          to="/feedback" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Give Feedback
        </Link>
      </div>
    </div>
  );
};

export default SitterDashboard;