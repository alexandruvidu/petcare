import {
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    FormLabel,
    Stack,
    OutlinedInput,
    Select,
    MenuItem,
    Grid,
    TextField
  } from "@mui/material";
  import { FormattedMessage, useIntl } from "react-intl";
  import { useBookingFormController } from "./BookingForm.controller";
  import { isEmpty, isUndefined } from "lodash";
  
  /**
   * Props for the BookingForm component
   */
  interface BookingFormProps {
    booking?: any;
    onSubmit?: () => void;
    onCancel?: () => void;
  }
  
  /**
   * Booking form component for creating or editing a booking
   */
  export const BookingForm = ({ booking, onSubmit, onCancel }: BookingFormProps) => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = useBookingFormController(booking, onSubmit);
  
    return (
      <form onSubmit={actions.handleSubmit(actions.submit)}>
        <Stack spacing={3}>
          {/* Date Selection Fields - Only for clients or when creating */}
          {(computed.isClient || !computed.isEditing) && (
            <>
              <FormControl
                fullWidth
                error={!isUndefined(state.errors.startDate)}
              >
                <FormLabel required>
                  <FormattedMessage id="forms.fields.startDate" defaultMessage="Start Date & Time" />
                </FormLabel>
                <TextField
                  type="datetime-local"
                  {...actions.register("startDate")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={computed.isEditing && !computed.isClient}
                />
                <FormHelperText error>
                  {state.errors.startDate?.message}
                </FormHelperText>
              </FormControl>
              
              <FormControl
                fullWidth
                error={!isUndefined(state.errors.endDate)}
              >
                <FormLabel required>
                  <FormattedMessage id="forms.fields.endDate" defaultMessage="End Date & Time" />
                </FormLabel>
                <TextField
                  type="datetime-local"
                  {...actions.register("endDate")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={computed.isEditing && !computed.isClient}
                />
                <FormHelperText error>
                  {state.errors.endDate?.message}
                </FormHelperText>
              </FormControl>
            </>
          )}
          
          {/* Notes Field - Optional, available for clients */}
          {(computed.isClient || !computed.isEditing) && (
            <FormControl
              fullWidth
              error={!isUndefined(state.errors.notes)}
            >
              <FormLabel>
                <FormattedMessage id="forms.fields.notes" defaultMessage="Notes for Sitter (Optional)" />
              </FormLabel>
              <OutlinedInput
                multiline
                rows={4}
                {...actions.register("notes")}
                placeholder={formatMessage({ id: "booking.notesPlaceholder", defaultMessage: "Describe any special requirements, pet needs, etc. (optional)" })}
                disabled={computed.isEditing && !computed.isClient}
              />
              <FormHelperText error>
                {state.errors.notes?.message}
              </FormHelperText>
            </FormControl>
          )}
          
          {/* Sitter Selection - Only for new bookings by client */}
          {computed.isClient && !computed.isEditing && (
            <FormControl
              fullWidth
              error={!isUndefined(state.errors.sitterId)}
            >
              <FormLabel required>
                <FormattedMessage id="forms.fields.sitter" defaultMessage="Select Sitter" />
              </FormLabel>
              <Select
                {...actions.register("sitterId")}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <em>{formatMessage({ id: "forms.placeholder.selectSitter", defaultMessage: "Select a sitter" })}</em>
                </MenuItem>
                {computed.sitters.map((sitter: any) => (
                  <MenuItem key={sitter.id} value={sitter.id}>
                    {sitter.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>
                {state.errors.sitterId?.message}
              </FormHelperText>
            </FormControl>
          )}
          
          {/* Pet Selection - Only for new bookings by client */}
          {computed.isClient && !computed.isEditing && (
            <FormControl
              fullWidth
              error={!isUndefined(state.errors.petId)}
            >
              <FormLabel required>
                <FormattedMessage id="forms.fields.pet" defaultMessage="Select Pet" />
              </FormLabel>
              <Select
                {...actions.register("petId")}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <em>{formatMessage({ id: "forms.placeholder.selectPet", defaultMessage: "Select a pet" })}</em>
                </MenuItem>
                {computed.pets.map((pet: any) => (
                  <MenuItem key={pet.id} value={pet.id}>
                    {pet.name} ({pet.type})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>
                {state.errors.petId?.message}
              </FormHelperText>
            </FormControl>
          )}
          
          {/* Status Update - Only for sitters */}
          {computed.isSitter && computed.isEditing && (
            <FormControl
              fullWidth
              error={!isUndefined(state.errors.status)}
            >
              <FormLabel required>
                <FormattedMessage id="forms.fields.status" defaultMessage="Update Status" />
              </FormLabel>
              <Select
                {...actions.register("status")}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <em>{formatMessage({ id: "forms.placeholder.selectStatus", defaultMessage: "Select status" })}</em>
                </MenuItem>
                <MenuItem value="Accepted">
                  <FormattedMessage id="status.accepted" defaultMessage="Accept" />
                </MenuItem>
                <MenuItem value="Rejected">
                  <FormattedMessage id="status.rejected" defaultMessage="Reject" />
                </MenuItem>
                <MenuItem value="Completed">
                  <FormattedMessage id="status.completed" defaultMessage="Mark as Completed" />
                </MenuItem>
              </Select>
              <FormHelperText error>
                {state.errors.status?.message}
              </FormHelperText>
            </FormControl>
          )}
          
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
                  computed.isEditing 
                    ? <FormattedMessage id="forms.update" defaultMessage="Update Booking" /> 
                    : <FormattedMessage id="forms.submit" defaultMessage="Create Booking" />
                )}
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </form>
    );
  };