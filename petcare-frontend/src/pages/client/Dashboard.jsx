import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ClientDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    petCount: 0,
    activeBookings: 0,
    completedBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        setUserData(user);

        // Fetch pet count
        const petsResponse = await axios.get('http://localhost:5000/api/Pet/GetMyPets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch bookings
        const bookingsResponse = await axios.get('http://localhost:5000/api/Booking/GetMyBookings', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (petsResponse.data && petsResponse.data.response) {
          setStats(prev => ({ ...prev, petCount: petsResponse.data.response.length }));
        }

        if (bookingsResponse.data && bookingsResponse.data.response) {
          const bookings = bookingsResponse.data.response;
          const active = bookings.filter(b => b.status === 'Pending' || b.status === 'Accepted').length;
          const completed = bookings.filter(b => b.status === 'Completed').length;
          
          setStats(prev => ({ 
            ...prev, 
            activeBookings: active,
            completedBookings: completed
          }));
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-red-50 p-4 rounded-md border border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {userData?.name}</h1>
        <p className="mt-2 text-gray-600">Manage your pets and bookings from your dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">My Pets</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.petCount}</p>
          <div className="mt-4">
            <Link 
              to="/client/pets" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Manage Pets →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Bookings</h3>
          <p className="text-3xl font-bold text-green-600">{stats.activeBookings}</p>
          <div className="mt-4">
            <Link 
              to="/client/bookings" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Bookings →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Completed Bookings</h3>
          <p className="text-3xl font-bold text-gray-600">{stats.completedBookings}</p>
          <div className="mt-4">
            <Link 
              to="/client/bookings" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View History →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/client/pets?action=add'} 
            className="bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 text-left"
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 rounded-md p-2 bg-blue-50 text-blue-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
              <div className="ml-3">
                <h3 className="text-gray-900 font-medium">Add a New Pet</h3>
                <p className="text-gray-500 text-sm">Register your pet's information</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => window.location.href = '/client/bookings?action=add'} 
            className="bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 text-left"
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 rounded-md p-2 bg-green-50 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <div className="ml-3">
                <h3 className="text-gray-900 font-medium">Book a Pet Sitter</h3>
                <p className="text-gray-500 text-sm">Schedule a new booking</p>
              </div>
            </div>
          </button>

          <Link 
            to="/sitters" 
            className="bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 text-left"
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 rounded-md p-2 bg-purple-50 text-purple-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <div className="ml-3">
                <h3 className="text-gray-900 font-medium">Find Pet Sitters</h3>
                <p className="text-gray-500 text-sm">Browse available sitters</p>
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

export default ClientDashboard;