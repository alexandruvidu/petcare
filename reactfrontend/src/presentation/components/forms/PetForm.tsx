import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    MenuItem,
    FormControl,
    FormHelperText,
    Grid,
    Typography
} from '@mui/material';
import { useIntl } from 'react-intl';
import { PetAddDTO, PetUpdateDTO } from '@infrastructure/apis/client';

interface PetFormProps {
    pet?: {
        id?: string;
        name: string;
        type: string;
        breed: string;
        age: number;
    };
    onSubmit: (petData: PetAddDTO | PetUpdateDTO) => void;
    onCancel: () => void;
}

export const PetForm = ({ pet, onSubmit, onCancel }: PetFormProps) => {
    const { formatMessage } = useIntl();
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        breed: '',
        age: ''
    });

    const [errors, setErrors] = useState<{
        name?: string;
        type?: string;
        breed?: string;
        age?: string;
    }>({});

    // Initialize form with pet data if editing
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors: {
            name?: string;
            type?: string;
            breed?: string;
            age?: string;
        } = {};

        if (!formData.name.trim()) {
            newErrors.name = formatMessage({ id: 'validation.required' }, { field: formatMessage({ id: 'pet.name' }) });
        }

        if (!formData.type.trim()) {
            newErrors.type = formatMessage({ id: 'validation.required' }, { field: formatMessage({ id: 'pet.type' }) });
        }

        if (!formData.breed.trim()) {
            newErrors.breed = formatMessage({ id: 'validation.required' }, { field: formatMessage({ id: 'pet.breed' }) });
        }

        if (!formData.age.trim()) {
            newErrors.age = formatMessage({ id: 'validation.required' }, { field: formatMessage({ id: 'pet.age' }) });
        } else if (isNaN(Number(formData.age)) || Number(formData.age) < 0 || Number(formData.age) > 100) {
            newErrors.age = formatMessage({ id: 'validation.ageRange' });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
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

    const petTypes = [
        'Dog',
        'Cat',
        'Bird',
        'Fish',
        'Rabbit',
        'Hamster',
        'Guinea Pig',
        'Reptile',
        'Other'
    ];

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl fullWidth error={!!errors.name}>
                        <TextField
                            label={formatMessage({ id: 'pet.name' })}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            error={!!errors.name}
                            fullWidth
                        />
                        {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.type}>
                        <TextField
                            select
                            label={formatMessage({ id: 'pet.type' })}
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            error={!!errors.type}
                            fullWidth
                        >
                            {petTypes.map(type => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                        {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.breed}>
                        <TextField
                            label={formatMessage({ id: 'pet.breed' })}
                            name="breed"
                            value={formData.breed}
                            onChange={handleChange}
                            required
                            error={!!errors.breed}
                            fullWidth
                        />
                        {errors.breed && <FormHelperText>{errors.breed}</FormHelperText>}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.age}>
                        <TextField
                            label={formatMessage({ id: 'pet.age' })}
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            required
                            error={!!errors.age}
                            fullWidth
                            inputProps={{ min: 0, max: 100 }}
                        />
                        {errors.age && <FormHelperText>{errors.age}</FormHelperText>}
                    </FormControl>
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={onCancel}
                >
                    {formatMessage({ id: 'buttons.cancel' })}
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    {pet ? formatMessage({ id: 'buttons.update' }) : formatMessage({ id: 'buttons.add' })}
                </Button>
            </Box>
        </Box>
    );
};