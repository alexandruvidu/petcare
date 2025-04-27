import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from '../../components/DataTable';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import BookingForm from '../../components/BookingForm';

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }
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

  // For client role, redirect to "Find Sitters" page
  const handleAdd = () => {
    navigate('/sitters');
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

  const columns = [
    {
      key: 'petName',
      header: 'Pet',
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
    },
    userRole === 'Client' ? {
      key: 'sitterName',
      header: 'Sitter',
    } : {
      key: 'clientName',
      header: 'Client',
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
      
      <DataTable
        title="Booking List"
        columns={columns}
        data={bookings}
        onAdd={userRole === 'Client' ? handleAdd : undefined}
        onEdit={handleEdit}
        onDelete={handleDelete}
        itemsPerPage={5}
      />

      {/* Booking Form Modal - Only for editing, not for adding */}
      {showModal && !isDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              Edit Booking
            </h2>
            <BookingForm
              booking={selectedBooking}
              userRole={userRole}
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
    </div>
  );
};

export default BookingsTable;