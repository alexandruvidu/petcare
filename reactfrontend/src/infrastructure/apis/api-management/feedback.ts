import { useAppSelector } from "@application/store";
import { Configuration, FeedbackApi, FeedbackAddDTO } from "../client"; // Correct imports
import { useMutation, useQueryClient } from "@tanstack/react-query";

const feedbackApiMutationKeys = {
    addFeedback: "addFeedbackMutation",
} as const;

const getFactory = (token: string | null) => new FeedbackApi(new Configuration({ accessToken: token ?? undefined })); // Use undefined if token is null for public endpoints

export const useAddFeedback = () => {
    const { token } = useAppSelector(x => x.profileReducer); // Token might be null for feedback
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [feedbackApiMutationKeys.addFeedback, token], // Token in key for potential re-fetch logic if tied to user
        mutationFn: (feedbackAddDTO: FeedbackAddDTO) =>
            getFactory(token).apiFeedbackAddPost({ feedbackAddDTO }),
        onSuccess: () => {
            // Optionally invalidate any queries that might be affected by feedback submission
            // For general feedback, usually no specific query invalidation is needed.
            // queryClient.invalidateQueries({ queryKey: ['someKey'] });
        },
    });
};