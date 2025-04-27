import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SitterProfile = () => {
  // Personal information state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  // Professional profile state
  const [profileData, setProfileData] = useState({
    bio: '',
    yearsExperience: '',
    hourlyRate: '',
    location: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingProfessional, setSavingProfessional] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [personalErrors, setPersonalErrors] = useState({});
  const [professionalErrors, setProfessionalErrors] = useState({});
  const [hasProfile, setHasProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch user data
        const userResponse = await axios.get('http://localhost:5000/api/User/GetMe', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (userResponse.data && userResponse.data.response) {
          const user = userResponse.data.response;
          setUserData(prev => ({
            ...prev,
            name: user.name,
            email: user.email,
            phone: user.phone
          }));
        }
        
        // Fetch sitter profile data
        try {
          const profileResponse = await axios.get('http://localhost:5000/api/SitterProfile/MyProfile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (profileResponse.data && profileResponse.data.response) {
            const profile = profileResponse.data.response;
            setProfileData({
              bio: profile.bio || '',
              yearsExperience: profile.yearsExperience?.toString() || '',
              hourlyRate: profile.hourlyRate?.toString() || '',
              location: profile.location || ''
            });
            setHasProfile(true);
          }
        } catch (err) {
          // If 404, it's fine - the user doesn't have a profile yet
          if (err.response && err.response.status !== 404) {
            console.error('Error fetching profile data:', err);
          }
          setHasProfile(false);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Personal information handlers
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePersonalForm = () => {
    const newErrors = {};
    
    // Only validate fields that have been modified
    if (userData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }
    
    if (userData.email === '') {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (userData.phone === '') {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(userData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Password validation only if the user wants to change it
    if (userData.password) {
      if (userData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (userData.password !== userData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setPersonalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    
    if (validatePersonalForm()) {
      setSavingPersonal(true);
      setError(null);
      setSuccess(null);
      
      try {
        const token = localStorage.getItem('token');
        const updateData = {
          name: userData.name,
          email: userData.email,
          phone: userData.phone
        };
        
        // Only include password if it has been changed
        if (userData.password) {
          updateData.password = userData.password;
        }
        
        const response = await axios.put('http://localhost:5000/api/User/Update', updateData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data && !response.data.errorMessage) {
          setSuccess('Personal information updated successfully!');
          
          // Update the stored user information
          const user = JSON.parse(localStorage.getItem('user'));
          if (user) {
            user.name = userData.name;
            user.email = userData.email;
            user.phone = userData.phone;
            localStorage.setItem('user', JSON.stringify(user));
          }
          
          // Clear password fields
          setUserData(prev => ({
            ...prev,
            password: '',
            confirmPassword: ''
          }));
        } else {
          setError(response.data.errorMessage?.message || 'Failed to update personal information');
        }
      } catch (err) {
        console.error('Error updating personal information:', err);
        setError(err.response?.data?.errorMessage?.message || 'An error occurred during update');
      } finally {
        setSavingPersonal(false);
      }
    }
  };

  // Professional profile handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profileData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (profileData.bio.length > 1000) {
      newErrors.bio = 'Bio must be less than 1000 characters';
    }
    
    if (!profileData.yearsExperience) {
      newErrors.yearsExperience = 'Years of experience is required';
    } else if (isNaN(profileData.yearsExperience) || parseInt(profileData.yearsExperience) < 0 || parseInt(profileData.yearsExperience) > 100) {
      newErrors.yearsExperience = 'Please enter a valid number between 0 and 100';
    }
    
    if (!profileData.hourlyRate) {
      newErrors.hourlyRate = 'Hourly rate is required';
    } else if (isNaN(profileData.hourlyRate) || parseFloat(profileData.hourlyRate) <= 0 || parseFloat(profileData.hourlyRate) > 1000) {
      newErrors.hourlyRate = 'Please enter a valid rate between 0 and 1000';
    }
    
    if (!profileData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (profileData.location.length > 200) {
      newErrors.location = 'Location must be less than 200 characters';
    }
    
    setProfessionalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (validateProfileForm()) {
      setSavingProfessional(true);
      setError(null);
      setSuccess(null);
      
      try {
        const token = localStorage.getItem('token');
        const data = {
          bio: profileData.bio,
          yearsExperience: parseInt(profileData.yearsExperience),
          hourlyRate: parseFloat(profileData.hourlyRate),
          location: profileData.location
        };

        let response;
        if (hasProfile) {
          // Update profile
          response = await axios.put('http://localhost:5000/api/SitterProfile/Update', data, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } else {
          // Create profile
          response = await axios.post('http://localhost:5000/api/SitterProfile/Add', data, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }
        
        if (response.data && !response.data.errorMessage) {
          setSuccess('Professional profile saved successfully!');
          setHasProfile(true);
        } else {
          setError(response.data.errorMessage?.message || 'Failed to save professional profile');
        }
      } catch (err) {
        console.error('Error saving professional profile:', err);
        setError(err.response?.data?.errorMessage?.message || 'An error occurred while saving your profile');
      } finally {
        setSavingProfessional(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-600">Manage your account information and sitter profile</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-md border border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 p-4 rounded-md border border-green-200">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${
                activeTab === 'personal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Information
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${
                activeTab === 'professional'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('professional')}
            >
              Sitter Profile
            </button>
          </nav>
        </div>
      </div>

      {/* Personal Information Tab */}
      {activeTab === 'personal' && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-medium text-gray-800">Personal Information</h2>
          </div>
          
          <form onSubmit={handlePersonalSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handlePersonalChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    personalErrors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {personalErrors.name && <p className="mt-1 text-sm text-red-500">{personalErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handlePersonalChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    personalErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {personalErrors.email && <p className="mt-1 text-sm text-red-500">{personalErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handlePersonalChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    personalErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {personalErrors.phone && <p className="mt-1 text-sm text-red-500">{personalErrors.phone}</p>}
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={userData.password}
                    onChange={handlePersonalChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      personalErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {personalErrors.password && <p className="mt-1 text-sm text-red-500">{personalErrors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handlePersonalChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      personalErrors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {personalErrors.confirmPassword && <p className="mt-1 text-sm text-red-500">{personalErrors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={savingPersonal}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPersonal ? 'Saving...' : 'Save Personal Information'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Professional Profile Tab */}
      {activeTab === 'professional' && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-medium text-gray-800">Professional Profile</h2>
            <p className="text-sm text-gray-500 mt-1">
              This information will be displayed to pet owners looking for sitters
            </p>
          </div>
          
          <form onSubmit={handleProfileSubmit} className="p-6">
            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={profileData.bio}
                onChange={handleProfileChange}
                placeholder="Tell pet owners about yourself, your experience with animals, and your pet care approach"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  professionalErrors.bio ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              ></textarea>
              {professionalErrors.bio && <p className="mt-1 text-sm text-red-500">{professionalErrors.bio}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="yearsExperience"
                  name="yearsExperience"
                  min="0"
                  max="100"
                  value={profileData.yearsExperience}
                  onChange={handleProfileChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    professionalErrors.yearsExperience ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {professionalErrors.yearsExperience && <p className="mt-1 text-sm text-red-500">{professionalErrors.yearsExperience}</p>}
              </div>

              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  id="hourlyRate"
                  name="hourlyRate"
                  min="0"
                  step="0.01"
                  value={profileData.hourlyRate}
                  onChange={handleProfileChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    professionalErrors.hourlyRate ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {professionalErrors.hourlyRate && <p className="mt-1 text-sm text-red-500">{professionalErrors.hourlyRate}</p>}
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={profileData.location}
                onChange={handleProfileChange}
                placeholder="City, State"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  professionalErrors.location ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {professionalErrors.location && <p className="mt-1 text-sm text-red-500">{professionalErrors.location}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingProfessional}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingProfessional ? 'Saving...' : (hasProfile ? 'Update Sitter Profile' : 'Create Sitter Profile')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SitterProfile;