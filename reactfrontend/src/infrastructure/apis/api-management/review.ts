import { useAppSelector } from "@application/store";
import { Configuration, ReviewApi, ReviewAddDTO, ReviewUpdateDTO } from "../client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const reviewApiQueryKeys = {
    getForSitter: "getReviewsForSitterQuery",
    getByBooking: "getReviewByBookingQuery",
} as const;

const reviewApiMutationKeys = {
    addReview: "addReviewMutation",
    updateReview: "updateReviewMutation",
    deleteReview: "deleteReviewMutation", // If needed
} as const;

const getFactory = (token: string | null) => new ReviewApi(new Configuration({ accessToken: token ?? "" }));

export const useGetReviewsForSitter = (sitterId: string | null | undefined) => {
    const { token } = useAppSelector(x => x.profileReducer);
    return useQuery({
        queryKey: [reviewApiQueryKeys.getForSitter, token, sitterId],
        queryFn: () => getFactory(token).apiReviewGetForSitterSitterIdGet({ sitterId: sitterId ?? "" }),
        enabled: !!token && !!sitterId,
    });
};

export const useGetReviewByBooking = (bookingId: string | null | undefined) => {
    const { token } = useAppSelector(x => x.profileReducer);
    return useQuery({
        queryKey: [reviewApiQueryKeys.getByBooking, token, bookingId],
        queryFn: () => getFactory(token).apiReviewGetByBookingBookingIdGet({ bookingId: bookingId ?? "" }),
        enabled: !!token && !!bookingId,
    });
};

export const useAddReview = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [reviewApiMutationKeys.addReview],
        mutationFn: (reviewAddDTO: ReviewAddDTO) => getFactory(token).apiReviewAddPost({ reviewAddDTO }),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [reviewApiQueryKeys.getForSitter, token, variables.sitterId] });
            queryClient.invalidateQueries({ queryKey: [reviewApiQueryKeys.getByBooking, token, variables.bookingId] });
        },
    });
};

export const useUpdateReview = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [reviewApiMutationKeys.updateReview],
        mutationFn: (params: { id: string, reviewUpdateDTO: ReviewUpdateDTO }) =>
            getFactory(token).apiReviewUpdateIdPut({ id: params.id, reviewUpdateDTO: params.reviewUpdateDTO }),
        onSuccess: (data, variables) => {
            // Assuming review DTO has sitterId and bookingId to invalidate specific queries
            // This might need adjustment based on actual API response or if fetching the review again
            queryClient.invalidateQueries({ queryKey: [reviewApiQueryKeys.getForSitter] }); // Invalidate all sitter reviews for simplicity
            queryClient.invalidateQueries({ queryKey: [reviewApiQueryKeys.getByBooking] }); // Invalidate all booking reviews
        },
    });
};

export const useDeleteReview = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [reviewApiMutationKeys.deleteReview],
        mutationFn: (id: string) => getFactory(token).apiReviewDeleteIdDelete({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [reviewApiQueryKeys.getForSitter] });
            queryClient.invalidateQueries({ queryKey: [reviewApiQueryKeys.getByBooking] });
        },
    });
};