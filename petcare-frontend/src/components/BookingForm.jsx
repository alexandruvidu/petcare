import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingForm = ({ booking, userRole, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    notes: '',
    status: '',
    sitterId: '',
    petId: ''
  });
  
  const [errors, setErrors] = useState({});
  const [sitters, setSitters] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem('token');
        
        // For clients, we need the list of sitters and their pets
        if (userRole === 'Client') {
          const [sittersResponse, petsResponse] = await Promise.all([
            axios.get('http://localhost:5000/api/User/GetAllSitters', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('http://localhost:5000/api/Pet/GetMyPets', {
              headers: { Authorization: `Bearer ${token}` }
            })
          ]);
          
          if (sittersResponse.data && sittersResponse.data.response) {
            setSitters(sittersResponse.data.response);
          }
          
          if (petsResponse.data && petsResponse.data.response) {
            setPets(petsResponse.data.response);
          }
        }
      } catch (err) {
        console.error('Error fetching form data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Pre-fill form if editing an existing booking
    if (booking) {
      // Format dates for date-time inputs
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDThh:mm
      };
      
      setFormData({
        startDate: formatDateForInput(booking.startDate) || '',
        endDate: formatDateForInput(booking.endDate) || '',
        notes: booking.notes || '',
        status: booking.status || '',
        sitterId: booking.sitterId || '',
        petId: booking.petId || ''
      });
    }
  }, [booking, userRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (!formData.notes.trim()) {
      newErrors.notes = 'Notes are required';
    } else if (formData.notes.length > 1000) {
      newErrors.notes = 'Notes must be less than 1000 characters';
    }
    
    if (userRole === 'Client' && !booking) {
      if (!formData.sitterId) {
        newErrors.sitterId = 'Please select a sitter';
      }
      
      if (!formData.petId) {
        newErrors.petId = 'Please select a pet';
      }
    }
    
    if (userRole === 'Sitter' && booking) {
      if (!formData.status) {
        newErrors.status = 'Please select a status';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const bookingData = { ...formData };
      
      // Remove fields that shouldn't be submitted based on user role and action
      if (booking) {
        // When updating
        if (userRole === 'Client') {
          // Clients can update dates and notes
          delete bookingData.status;
          delete bookingData.sitterId;
          delete bookingData.petId;
        } else if (userRole === 'Sitter') {
          // Sitters can only update status
          delete bookingData.startDate;
          delete bookingData.endDate;
          delete bookingData.notes;
          delete bookingData.sitterId;
          delete bookingData.petId;
        }
      }
      
      onSubmit(bookingData);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Date Selection Fields */}
      {(!booking || (booking && userRole === 'Client')) && (
        <>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.startDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.endDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
          </div>
        </>
      )}
      
      {/* Notes Field */}
      {(!booking || (booking && userRole === 'Client')) && (
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes for Sitter
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.notes ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Describe any special requirements, pet needs, etc."
          ></textarea>
          {errors.notes && <p className="mt-1 text-sm text-red-500">{errors.notes}</p>}
        </div>
      )}
      
      {/* Sitter Selection (for new bookings by client) */}
      {userRole === 'Client' && !booking && (
        <div className="mb-4">
          <label htmlFor="sitterId" className="block text-sm font-medium text-gray-700 mb-1">
            Select Sitter
          </label>
          <select
            id="sitterId"
            name="sitterId"
            value={formData.sitterId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.sitterId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            <option value="">-- Select a sitter --</option>
            {sitters.map(sitter => (
              <option key={sitter.id} value={sitter.id}>{sitter.name}</option>
            ))}
          </select>
          {errors.sitterId && <p className="mt-1 text-sm text-red-500">{errors.sitterId}</p>}
        </div>
      )}
      
      {/* Pet Selection (for new bookings by client) */}
      {userRole === 'Client' && !booking && (
        <div className="mb-4">
          <label htmlFor="petId" className="block text-sm font-medium text-gray-700 mb-1">
            Select Pet
          </label>
          <select
            id="petId"
            name="petId"
            value={formData.petId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.petId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            <option value="">-- Select a pet --</option>
            {pets.map(pet => (
              <option key={pet.id} value={pet.id}>{pet.name} ({pet.type})</option>
            ))}
          </select>
          {errors.petId && <p className="mt-1 text-sm text-red-500">{errors.petId}</p>}
        </div>
      )}
      
      {/* Status Update (for sitters) */}
      {userRole === 'Sitter' && booking && (
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Update Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            <option value="">-- Select status --</option>
            <option value="Accepted">Accept</option>
            <option value="Rejected">Reject</option>
            <option value="Completed">Mark as Completed</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
        </div>
      )}
      
      <div className="flex justify-end space-x-2 mt-6">
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
          {booking ? 'Update Booking' : 'Create Booking'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;