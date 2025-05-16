// Enum for feedback type (matches backend)
export enum FeedbackType {
    GeneralInquiry = "GeneralInquiry",
    BugReport = "BugReport",
    FeatureRequest = "FeatureRequest",
    Compliment = "Compliment",
}

// Enum for contact preference (matches backend)
export enum ContactPreference {
    NoContact = "NoContact", // Default to match backend default (0)
    Email = "Email",
    Phone = "Phone",
}

export interface FeedbackFormModel {
    rating: number;
    comment: string;
    email?: string; // Optional email for non-logged-in users
    feedbackType: FeedbackType | ''; // Allow empty string for placeholder/no selection
    contactPreference: ContactPreference | ''; // Allow empty string for placeholder/no selection
    allowFollowUp: boolean;
}