import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from '../../components/DataTable';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import BookingForm from '../../components/BookingForm';
import BookingCalendar from '../../components/BookingCalendar';
import BookingDetailModal from '../../components/ui/BookingDetailModal';

const SitterBookingsView = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState('calendar'); // Default to calendar for sitters
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/Booking/GetMyBookings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.response) {
        setBookings(response.data.response);
      } else {
        setBookings([]);
      }
    } catch (err) {
      setError('Failed to fetch bookings. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
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

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsDeleteModal(false);
    setShowModal(true);
  };

  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setIsDeleteModal(true);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/Booking/Delete/${selectedBooking.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the local state after successful deletion
      setBookings(bookings.filter(booking => booking.id !== selectedBooking.id));
    } catch (err) {
      setError('Failed to delete booking. Please try again later.');
      console.error(err);
    }
  };

  const handleFormSubmit = async (bookingData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (selectedBooking) {
        // Update booking
        await axios.put(`http://localhost:5000/api/Booking/Update/${selectedBooking.id}`, bookingData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Refresh the booking list
      fetchBookings();
      
      // Close the modal
      setShowModal(false);
    } catch (err) {
      setError('Failed to update booking.');
      console.error(err);
    }
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const columns = [
    {
      key: 'petName',
      header: 'Pet',
    },
    {
      key: 'clientName',
      header: 'Client',
    },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (booking) => formatDate(booking.startDate)
    },
    {
      key: 'endDate',
      header: 'End Date',
      render: (booking) => formatDate(booking.endDate)
    },
    {
      key: 'status',
      header: 'Status',
      render: (booking) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(booking.status)}`}>
          {booking.status}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* View toggle */}
      <div className="mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          >
            List View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              viewMode === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          >
            Calendar View
          </button>
        </div>
      </div>
      
      {/* View content */}
      {viewMode === 'list' ? (
        <DataTable
          title="Booking List"
          columns={columns}
          data={bookings}
          onEdit={handleEdit}
          onDelete={handleDelete}
          itemsPerPage={5}
        />
      ) : (
        <BookingCalendar 
          bookings={bookings} 
          onBookingClick={handleBookingClick} 
        />
      )}
      
      {/* Booking Form Modal - Only for editing, not for adding */}
      {showModal && !isDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              Update Booking Status
            </h2>
            <BookingForm
              booking={selectedBooking}
              userRole="Sitter"
              onSubmit={handleFormSubmit}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showModal && isDeleteModal}
        title="Delete Booking"
        message={`Are you sure you want to delete this booking${selectedBooking?.petName ? ` for ${selectedBooking.petName}` : ''}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onClose={() => setShowModal(false)}
      />
      
      {/* Booking Detail Modal */}
      {showDetailModal && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          userRole="Sitter"
          onClose={() => setShowDetailModal(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default SitterBookingsView;