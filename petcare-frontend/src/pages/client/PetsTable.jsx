import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import PetForm from '../../components/PetForm';

const PetsTable = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/Pet/GetMyPets', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.response) {
        setPets(response.data.response);
      } else {
        setPets([]);
      }
    } catch (err) {
      setError('Failed to fetch pets. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleAdd = () => {
    setSelectedPet(null);
    setIsDeleteModal(false);
    setShowModal(true);
  };

  const handleEdit = (pet) => {
    setSelectedPet(pet);
    setIsDeleteModal(false);
    setShowModal(true);
  };

  const handleDelete = (pet) => {
    setSelectedPet(pet);
    setIsDeleteModal(true);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/Pet/Delete/${selectedPet.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the local state after successful deletion
      setPets(pets.filter(pet => pet.id !== selectedPet.id));
    } catch (err) {
      setError('Failed to delete pet. Please try again later.');
      console.error(err);
    }
  };

  const handleFormSubmit = async (petData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (selectedPet) {
        // Update pet
        await axios.put(`http://localhost:5000/api/Pet/Update/${selectedPet.id}`, petData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Add pet
        await axios.post('http://localhost:5000/api/Pet/Add', petData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Refresh the pet list
      fetchPets();
      
      // Close the modal
      setShowModal(false);
    } catch (err) {
      setError(selectedPet ? 'Failed to update pet.' : 'Failed to add pet.');
      console.error(err);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
    },
    {
      key: 'type',
      header: 'Type',
    },
    {
      key: 'breed',
      header: 'Breed',
    },
    {
      key: 'age',
      header: 'Age',
      render: (pet) => `${pet.age} ${pet.age === 1 ? 'year' : 'years'}`
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
      <h1 className="text-2xl font-bold mb-6">My Pets</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <DataTable
        title="Pet List"
        columns={columns}
        data={pets}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        itemsPerPage={5}
      />

      {/* Pet Form Modal */}
      {showModal && !isDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {selectedPet ? 'Edit Pet' : 'Add New Pet'}
            </h2>
            <PetForm
              pet={selectedPet}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showModal && isDeleteModal}
        title="Delete Pet"
        message={`Are you sure you want to delete ${selectedPet?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default PetsTable;