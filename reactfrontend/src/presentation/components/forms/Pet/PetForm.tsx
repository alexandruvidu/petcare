import {
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    FormLabel,
    Stack,
    OutlinedInput,
    MenuItem,
    Select,
    Grid,
    TextField
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { usePetFormController } from "./PetForm.controller";
import { isEmpty, isUndefined } from "lodash";

/**
 * Props for the PetForm component
 */
interface PetFormProps {
    pet?: {
        id: string;
        name: string;
        type: string;
        breed: string;
        age: number;
    };
    onSubmit?: () => void;
    onCancel?: () => void;
}

/**
 * Pet form component for adding or editing a pet
 */
export const PetForm = ({ pet, onSubmit, onCancel }: PetFormProps) => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = usePetFormController(pet, onSubmit);

    return (
        <form onSubmit={actions.handleSubmit(actions.submit)}>
            <Stack spacing={3}>
                <FormControl
                    fullWidth
                    error={!isUndefined(state.errors.name)}
                >
                    <FormLabel required>
                        <FormattedMessage id="forms.fields.name" defaultMessage="Pet Name" />
                    </FormLabel>
                    <OutlinedInput
                        {...actions.register("name")}
                        placeholder={formatMessage(
                            { id: "forms.placeholder", defaultMessage: "Enter your pet's {field}" },
                            { field: formatMessage({ id: "forms.fields.name", defaultMessage: "name" }) }
                        )}
                    />
                    <FormHelperText error>
                        {state.errors.name?.message}
                    </FormHelperText>
                </FormControl>

                <FormControl
                    fullWidth
                    error={!isUndefined(state.errors.type)}
                >
                    <FormLabel required>
                        <FormattedMessage id="forms.fields.petType" defaultMessage="Pet Type" />
                    </FormLabel>
                    <Select
                        {...actions.register("type")}
                        value={actions.watch("type")}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>
                            <em>{formatMessage({ id: "forms.placeholder.select", defaultMessage: "Select pet type" })}</em>
                        </MenuItem>
                        <MenuItem value="Dog">
                            <FormattedMessage id="petTypes.dog" defaultMessage="Dog" />
                        </MenuItem>
                        <MenuItem value="Cat">
                            <FormattedMessage id="petTypes.cat" defaultMessage="Cat" />
                        </MenuItem>
                        <MenuItem value="Bird">
                            <FormattedMessage id="petTypes.bird" defaultMessage="Bird" />
                        </MenuItem>
                        <MenuItem value="Fish">
                            <FormattedMessage id="petTypes.fish" defaultMessage="Fish" />
                        </MenuItem>
                        <MenuItem value="Rabbit">
                            <FormattedMessage id="petTypes.rabbit" defaultMessage="Rabbit" />
                        </MenuItem>
                        <MenuItem value="Hamster">
                            <FormattedMessage id="petTypes.hamster" defaultMessage="Hamster" />
                        </MenuItem>
                        <MenuItem value="Guinea Pig">
                            <FormattedMessage id="petTypes.guineaPig" defaultMessage="Guinea Pig" />
                        </MenuItem>
                        <MenuItem value="Reptile">
                            <FormattedMessage id="petTypes.reptile" defaultMessage="Reptile" />
                        </MenuItem>
                        <MenuItem value="Other">
                            <FormattedMessage id="petTypes.other" defaultMessage="Other" />
                        </MenuItem>
                    </Select>
                    <FormHelperText error>
                        {state.errors.type?.message}
                    </FormHelperText>
                </FormControl>

                <FormControl
                    fullWidth
                    error={!isUndefined(state.errors.breed)}
                >
                    <FormLabel required>
                        <FormattedMessage id="forms.fields.breed" defaultMessage="Breed" />
                    </FormLabel>
                    <OutlinedInput
                        {...actions.register("breed")}
                        placeholder={formatMessage(
                            { id: "forms.placeholder", defaultMessage: "Enter your pet's {field}" },
                            { field: formatMessage({ id: "forms.fields.breed", defaultMessage: "breed" }) }
                        )}
                    />
                    <FormHelperText error>
                        {state.errors.breed?.message}
                    </FormHelperText>
                </FormControl>

                <FormControl
                    fullWidth
                    error={!isUndefined(state.errors.age)}
                >
                    <FormLabel required>
                        <FormattedMessage id="forms.fields.age" defaultMessage="Age" />
                    </FormLabel>
                    <TextField
                        type="number"
                        {...actions.register("age")}
                        inputProps={{ min: 0, max: 100 }}
                    />
                    <FormHelperText error>
                        {state.errors.age?.message}
                    </FormHelperText>
                </FormControl>

                <Grid container spacing={2} justifyContent="flex-end">
                    {onCancel && (
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={onCancel}
                            >
                                <FormattedMessage id="forms.cancel" defaultMessage="Cancel" />
                            </Button>
                        </Grid>
                    )}
                    <Grid item>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!isEmpty(state.errors) || computed.isSubmitting}
                        >
                            {computed.isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                pet
                                    ? <FormattedMessage id="forms.update" defaultMessage="Update Pet" />
                                    : <FormattedMessage id="forms.submit" defaultMessage="Add Pet" />
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </Stack>
        </form>
    );
};
