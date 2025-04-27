import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SittersList = () => {
  const [sitters, setSitters] = useState([]);
  const [filteredSitters, setFilteredSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSitter, setSelectedSitter] = useState(null);
  const [sitterProfile, setSitterProfile] = useState(null);
  const [sitterReviews, setSitterReviews] = useState({});
  const [pets, setPets] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    notes: '',
    petId: '',
    sitterId: ''
  });
  const navigate = useNavigate();

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch all sitters
        const sittersResponse = await axios.get('http://localhost:5000/api/User/GetAllSitters', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch client's pets
        const petsResponse = await axios.get('http://localhost:5000/api/Pet/GetMyPets', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (sittersResponse.data && sittersResponse.data.response) {
          const allSitters = sittersResponse.data.response;
          
          // We need to filter sitters to only show those with completed profiles
          const sittersWithProfiles = await filterSittersWithProfiles(allSitters, token);
          
          // Fetch reviews for each sitter
          const sittersWithReviews = await fetchSittersReviews(sittersWithProfiles, token);
          
          setSitters(sittersWithReviews);
          setFilteredSitters(sittersWithReviews);
        }

        if (petsResponse.data && petsResponse.data.response) {
          setPets(petsResponse.data.response);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load sitters. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to filter sitters who have completed profiles
  const filterSittersWithProfiles = async (sittersList, token) => {
    const sittersWithProfiles = [];

    // Check each sitter to see if they have a profile
    for (const sitter of sittersList) {
      try {
        const profileResponse = await axios.get(`http://localhost:5000/api/SitterProfile/Get/${sitter.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // If profile exists, add sitter to the list with profile data
        if (profileResponse.data && profileResponse.data.response) {
          sittersWithProfiles.push({
            ...sitter,
            profile: profileResponse.data.response
          });
        }
      } catch (err) {
        // Skip sitters with no profile
        continue;
      }
    }

    return sittersWithProfiles;
  };

  // Function to fetch reviews for each sitter
  const fetchSittersReviews = async (sittersList, token) => {
    const reviewsMap = {};
    
    for (const sitter of sittersList) {
      try {
        const reviewsResponse = await axios.get(`http://localhost:5000/api/Review/GetForSitter/${sitter.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (reviewsResponse.data && reviewsResponse.data.response) {
          const reviews = reviewsResponse.data.response;
          let totalRating = 0;
          
          reviews.forEach(review => {
            totalRating += review.rating;
          });
          
          const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
          
          reviewsMap[sitter.id] = {
            count: reviews.length,
            averageRating: avgRating
          };
        } else {
          reviewsMap[sitter.id] = { count: 0, averageRating: 0 };
        }
      } catch (err) {
        reviewsMap[sitter.id] = { count: 0, averageRating: 0 };
      }
    }
    
    setSitterReviews(reviewsMap);
    
    // Return sitters with their reviews data
    return sittersList.map(sitter => ({
      ...sitter,
      reviews: reviewsMap[sitter.id] || { count: 0, averageRating: 0 }
    }));
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSitters(sitters);
    } else {
      const filtered = sitters.filter(
        sitter => 
          sitter.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          sitter.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSitters(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, sitters]);

  const fetchSitterProfile = async (sitterId) => {
    // Since we already have the profile data from initial load, just find the sitter
    const sitter = sitters.find(s => s.id === sitterId);
    if (sitter && sitter.profile) {
      setSitterProfile(sitter.profile);
    } else {
      setSitterProfile(null);
    }
  };

  const handleSitterSelect = async (sitter) => {
    setSelectedSitter(sitter);
    await fetchSitterProfile(sitter.id);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBookNow = (sitter) => {
    setBookingData(prev => ({
      ...prev,
      sitterId: sitter.id
    }));
    setShowBookingModal(true);
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!bookingData.startDate || !bookingData.endDate || !bookingData.petId) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Check that end date is after start date
    if (new Date(bookingData.endDate) <= new Date(bookingData.startDate)) {
      setError('End date must be after start date');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.post('http://localhost:5000/api/Booking/Create', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setShowBookingModal(false);
      navigate('/client/bookings');
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again.');
    }
  };

  // Render star rating
  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSitters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSitters.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find a Pet Sitter</h1>
        <p className="mt-2 text-gray-600">Browse our qualified pet sitters and schedule a booking</p>
      </div>

      {/* Search and filters */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Sitters list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sitters cards */}
        <div className="col-span-2">
          {currentItems.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500">No sitters found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentItems.map((sitter) => (
                <div
                  key={sitter.id}
                  className={`bg-white p-4 rounded-lg shadow-md border ${
                    selectedSitter?.id === sitter.id ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {sitter.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{sitter.name}</h3>
                      
                      {/* Rating and review count */}
                      <div className="flex items-center mt-1">
                        <div className="flex text-sm">
                          {renderStarRating(sitter.reviews.averageRating)}
                        </div>
                        <span className="ml-1 text-sm text-gray-500">
                          ({sitter.reviews.count} {sitter.reviews.count === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                      
                      {/* Location from profile */}
                      {sitter.profile && (
                        <p className="text-sm text-gray-500 mt-1">
                          {sitter.profile.location}
                        </p>
                      )}
                      
                      {/* Hourly rate if available */}
                      {sitter.profile && (
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          ${sitter.profile.hourlyRate}/hr
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleSitterSelect(sitter)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  } px-3 py-1 border border-gray-300 rounded-l focus:outline-none`}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => {
                  // Show limited page numbers
                  if (
                    i === 0 ||
                    i === totalPages - 1 ||
                    (i >= currentPage - 2 && i <= currentPage + 0)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-blue-600 hover:bg-blue-50'
                        } px-3 py-1 border border-gray-300 focus:outline-none`}
                      >
                        {i + 1}
                      </button>
                    );
                  } else if (
                    i === currentPage - 3 ||
                    i === currentPage + 1
                  ) {
                    return (
                      <button
                        key={i}
                        className="px-3 py-1 border border-gray-300 bg-white text-gray-500 focus:outline-none"
                        disabled
                      >
                        ...
                      </button>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  } px-3 py-1 border border-gray-300 rounded-r focus:outline-none`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* Sitter details panel */}
        <div className="col-span-1">
          {selectedSitter ? (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 sticky top-4">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                  {selectedSitter.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium text-gray-900">{selectedSitter.name}</h3>
                  
                  {/* Rating display */}
                  <div className="flex items-center mt-1">
                    <div className="flex text-sm">
                      {renderStarRating(selectedSitter.reviews.averageRating)}
                    </div>
                    <Link 
                      to={`/sitter-reviews/${selectedSitter.id}`}
                      className="ml-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      ({selectedSitter.reviews.count} {selectedSitter.reviews.count === 1 ? 'review' : 'reviews'})
                    </Link>
                  </div>
                </div>
              </div>

              {sitterProfile ? (
                <div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Bio</h4>
                    <p className="mt-1 text-gray-800">{sitterProfile.bio}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Experience</h4>
                      <p className="mt-1 text-gray-800">{sitterProfile.yearsExperience} years</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Rate</h4>
                      <p className="mt-1 text-gray-800">${sitterProfile.hourlyRate}/hour</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Location</h4>
                    <p className="mt-1 text-gray-800">{sitterProfile.location}</p>
                  </div>

                  <button
                    onClick={() => handleBookNow(selectedSitter)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Book {selectedSitter.name}
                  </button>
                </div>
              ) : (
                <div className="py-4 text-center text-gray-500">
                  <p>Loading profile information...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Select a Sitter</h3>
              <p className="text-blue-600">
                Click on "View Details" to see more information about a pet sitter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal - with optional notes */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 bg-blue-600">
              <h3 className="text-lg font-medium text-white">Book a Pet Sitter</h3>
            </div>
            <form onSubmit={handleBookingSubmit} className="p-6">
              <div className="mb-4">
                <label htmlFor="petId" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Pet*
                </label>
                <select
                  id="petId"
                  name="petId"
                  value={bookingData.petId}
                  onChange={handleBookingInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select a pet --</option>
                  {pets.map(pet => (
                    <option key={pet.id} value={pet.id}>{pet.name} ({pet.type})</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time*
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={bookingData.startDate}
                  onChange={handleBookingInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date & Time*
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={bookingData.endDate}
                  onChange={handleBookingInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes for Sitter (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={bookingData.notes}
                  onChange={handleBookingInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your pet's needs, special instructions, etc. (optional)"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SittersList;