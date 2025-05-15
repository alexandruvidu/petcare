export interface FeedbackFormModel {
    rating: number;
    comment: string;
    email?: string; // Optional email for non-logged-in users
}