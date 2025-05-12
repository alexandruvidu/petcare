import { useAppSelector } from "@application/store";
import { Configuration, BookingApi, BookingAddDTO, BookingUpdateDTO } from "../client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const bookingApiQueryKeys = {
    myBookings: "getMyBookingsQuery",
    bookingById: "getBookingByIdQuery",
} as const;

const bookingApiMutationKeys = {
    createBooking: "createBookingMutation",
    updateBooking: "updateBookingMutation",
    deleteBooking: "deleteBookingMutation",
} as const;

const getFactory = (token: string | null) => new BookingApi(new Configuration({ accessToken: token ?? "" }));

export const useGetMyBookings = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    return useQuery({
        queryKey: [bookingApiQueryKeys.myBookings, token],
        queryFn: () => getFactory(token).apiBookingGetMyBookingsGet(),
        enabled: !!token,
    });
};

export const useGetBookingById = (id: string | null | undefined) => {
    const { token } = useAppSelector(x => x.profileReducer);
    return useQuery({
        queryKey: [bookingApiQueryKeys.bookingById, token, id],
        queryFn: () => getFactory(token).apiBookingGetByIdIdGet({ id: id ?? ""}),
        enabled: !!token && !!id,
    });
};

export const useCreateBooking = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [bookingApiMutationKeys.createBooking],
        mutationFn: (bookingAddDTO: BookingAddDTO) => getFactory(token).apiBookingCreatePost({ bookingAddDTO }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [bookingApiQueryKeys.myBookings] });
        },
    });
};

export const useUpdateBooking = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [bookingApiMutationKeys.updateBooking],
        mutationFn: (params: { id: string, bookingUpdateDTO: BookingUpdateDTO }) =>
            getFactory(token).apiBookingUpdateIdPut({ id: params.id, bookingUpdateDTO: params.bookingUpdateDTO }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [bookingApiQueryKeys.myBookings] });
            queryClient.invalidateQueries({ queryKey: [bookingApiQueryKeys.bookingById, token, variables.id] });
        },
    });
};

export const useDeleteBooking = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [bookingApiMutationKeys.deleteBooking],
        mutationFn: (id: string) => getFactory(token).apiBookingDeleteIdDelete({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [bookingApiQueryKeys.myBookings] });
        },
    });
};