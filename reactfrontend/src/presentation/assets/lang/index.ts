import ro from "./ro";
import en from "./en";
import { UserRoleEnum } from "@infrastructure/apis/client"; // Added for new keys

export enum SupportedLanguage {
  EN = "en",
  RO = "ro",
}

type ReactIntlMessages = {
  en: Record<string, string>;
  ro: Record<string, string>;
};

const messages: ReactIntlMessages = {
  en,
  ro,
};

/**
 * Add any message IDs in its corresponding JSON file for each language to be used here to replace it with the translation via this function.
 */
export const getMessagesForLanguage = (language: SupportedLanguage) =>
    messages[language];

/**
 * New translation keys for PetForm, BookingForm etc.
 */
export const petTypes = (formatMessage: (descriptor: { id: string }) => string) => [
  { value: 'Dog', label: formatMessage({ id: 'pet.type.dog' }) },
  { value: 'Cat', label: formatMessage({ id: 'pet.type.cat' }) },
  { value: 'Bird', label: formatMessage({ id: 'pet.type.bird' }) },
  { value: 'Fish', label: formatMessage({ id: 'pet.type.fish' }) },
  { value: 'Rabbit', label: formatMessage({ id: 'pet.type.rabbit' }) },
  { value: 'Hamster', label: formatMessage({ id: 'pet.type.hamster' }) },
  { value: 'Guinea Pig', label: formatMessage({ id: 'pet.type.guineaPig' }) },
  { value: 'Reptile', label: formatMessage({ id: 'pet.type.reptile' }) },
  { value: 'Other', label: formatMessage({ id: 'pet.type.other' }) },
];

export const userRoles = (formatMessage: (descriptor: { id: string }) => string) => [
  { value: UserRoleEnum.Client, label: formatMessage({id: "globals.client"}) },
  { value: UserRoleEnum.Sitter, label: formatMessage({id: "globals.sitter"}) },
  // { value: UserRoleEnum.Admin, label: formatMessage({id: "globals.admin"}) }, // If Admin registration is allowed
];

// Add new keys to en/labels.json and ro/labels.json:
// "footer.copyright": "© {year} PetCare. All rights reserved." (and RO version)
// "pet.name": "Pet Name"
// "pet.type": "Pet Type"
// "pet.breed": "Breed"
// "pet.age": "Age"
// "validation.required": "{field} is required."
// "validation.ageRange": "Age must be a number between 0 and 100."
// "buttons.cancel": "Cancel"
// "buttons.update": "Update"
// "buttons.add": "Add"
// "pet.type.dog": "Dog", "pet.type.cat": "Cat", ...etc.
// "booking.startDate": "Start Date & Time"
// "booking.endDate": "End Date & Time"
// "booking.notes": "Notes for Sitter (Optional)"
// "booking.selectPet": "Select Pet"
// "booking.selectSitter": "Select Sitter"
// "booking.status": "Status"
// "booking.status.pending": "Pending"
// "booking.status.accepted": "Accepted"
// "booking.status.rejected": "Rejected"
// "booking.status.completed": "Completed"
// "validation.endDateAfterStartDate": "End date must be after start date."
// "sitter.bioPlaceholder": "Tell pet owners about yourself, your experience with animals, and your pet care approach"
// "sitter.locationPlaceholder": "City, State"
// "review.ratingPlaceholder": "Select a rating from 1 to 5"
// "review.commentPlaceholder": "Share your experience with this pet sitter..."
// "error.defaultApi": "An error occurred. Please try again."
// "success.profileUpdate": "Profile updated successfully!"
// "success.petAdded": "Pet added successfully!"
// "success.petUpdated": "Pet updated successfully!"
// "success.petDeleted": "Pet deleted successfully!"
// "success.bookingCreated": "Booking created successfully!"
// "success.bookingUpdated": "Booking updated successfully!"
// "success.bookingDeleted": "Booking deleted successfully!"
// "success.reviewSubmitted": "Review submitted successfully!"
// "success.reviewUpdated": "Review updated successfully!"