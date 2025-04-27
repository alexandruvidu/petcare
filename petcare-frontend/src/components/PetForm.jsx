import React, { useState, useEffect } from 'react';

const PetForm = ({ pet, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        type: pet.type || '',
        breed: pet.breed || '',
        age: pet.age ? pet.age.toString() : ''
      });
    }
  }, [pet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.type.trim()) {
      newErrors.type = 'Type is required';
    }
    
    if (!formData.breed.trim()) {
      newErrors.breed = 'Breed is required';
    }
    
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || parseInt(formData.age) < 0 || parseInt(formData.age) > 100) {
      newErrors.age = 'Age must be a number between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: formData.name,
        type: formData.type,
        breed: formData.breed,
        age: parseInt(formData.age)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Pet Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
            errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Pet Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
            errors.type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
        >
          <option value="">Select pet type</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Fish">Fish</option>
          <option value="Rabbit">Rabbit</option>
          <option value="Hamster">Hamster</option>
          <option value="Guinea Pig">Guinea Pig</option>
          <option value="Reptile">Reptile</option>
          <option value="Other">Other</option>
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
          Breed
        </label>
        <input
          type="text"
          id="breed"
          name="breed"
          value={formData.breed}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
            errors.breed ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {errors.breed && <p className="mt-1 text-sm text-red-500">{errors.breed}</p>}
      </div>
      
      <div className="mb-6">
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
          Age
        </label>
        <input
          type="number"
          id="age"
          name="age"
          min="0"
          max="100"
          value={formData.age}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
            errors.age ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
      </div>
      
      <div className="flex justify-end space-x-2">
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
          {pet ? 'Update Pet' : 'Add Pet'}
        </button>
      </div>
    </form>
  );
};

export default PetForm;