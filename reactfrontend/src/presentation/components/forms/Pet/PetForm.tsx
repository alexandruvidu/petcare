import React from 'react';
import {
    TextField,
    Button,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Grid,
    CircularProgress,
    Typography,
    FormHelperText
} from '@mui/material';
import { useIntl, FormattedMessage } from 'react-intl';
import { PetFormProps } from "./PetForm.types";
import { usePetFormController } from "./PetForm.controller";
import { Controller } from "react-hook-form";
import { petTypes as getPetTypeOptions } from '@presentation/assets/lang';


export const PetForm: React.FC<PetFormProps> = (props) => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = usePetFormController(props);
    const petTypeOptions = getPetTypeOptions(formatMessage);


    return (
        <Box component="form" onSubmit={actions.handleSubmit(actions.submit)} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6" gutterBottom>
                {computed.isEditMode ? formatMessage({id: "labels.editPet"}) : formatMessage({id: "labels.addPet"})}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="name"
                        label={formatMessage({ id: 'pet.name' })}
                        {...actions.register("name")}
                        error={!!state.errors.name}
                        helperText={state.errors.name?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!state.errors.type}>
                        <InputLabel id="type-select-label" required>
                            <FormattedMessage id="pet.type" />
                        </InputLabel>
                        <Controller
                            name="type"
                            control={actions.control}
                            render={({ field }) => (
                                <Select
                                    labelId="type-select-label"
                                    label={<FormattedMessage id="pet.type" />}
                                    {...field}
                                >
                                    <MenuItem value="" disabled>
                                        <FormattedMessage id="globals.placeholders.selectInput" values={{ fieldName: formatMessage({ id: "pet.type" })}} />
                                    </MenuItem>
                                    {petTypeOptions.map(type => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {state.errors.type && <FormHelperText>{state.errors.type.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        id="breed"
                        label={formatMessage({ id: 'pet.breed' })}
                        {...actions.register("breed")}
                        error={!!state.errors.breed}
                        helperText={state.errors.breed?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        id="age"
                        label={formatMessage({ id: 'pet.age' })}
                        type="number"
                        {...actions.register("age")}
                        error={!!state.errors.age}
                        helperText={state.errors.age?.message}
                        inputProps={{ min: 0, max: 100 }}
                    />
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                <Button
                    onClick={props.onSubmitSuccess} // Assuming this closes modal or navigates
                    disabled={computed.isSubmitting}
                >
                    <FormattedMessage id="buttons.cancel" />
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={computed.isSubmitting}
                >
                    {computed.isSubmitting ? <CircularProgress size={24} /> : (computed.isEditMode ? <FormattedMessage id="buttons.update" /> : <FormattedMessage id="buttons.add" />)}
                </Button>
            </Box>
        </Box>
    );
};