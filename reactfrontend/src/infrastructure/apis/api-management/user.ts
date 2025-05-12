import { useAppSelector } from "@application/store";
import {Configuration, UserAddDTO, UserApi, UserUpdateDTO} from "../client"; // Added UserUpdateDTO
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {isEmpty} from "lodash";

/**
 * Use constants to identify mutations and queries.
 */
const getUsersQueryKey = "getUsersQuery";
const getUserQueryKey = "getUserQuery"; // Used for GetMe and GetById
const addUserMutationKey = "addUserMutation";
const deleteUserMutationKey = "deleteUserMutation";
const updateUserMutationKey = "updateUserMutation"; // New
const getAllSittersQueryKey = "getAllSittersQuery"; // New

const getFactory = (token: string | null) => new UserApi(new Configuration({accessToken: token ?? ""}));

export const useGetUsers = (page: number, pageSize: number, search: string = "") => {
    const {token} = useAppSelector(x => x.profileReducer);

    return {
        ...useQuery({
            queryKey: [getUsersQueryKey, token, page, pageSize, search],
            queryFn: async () => await getFactory(token).apiUserGetPageGet({page, pageSize, search}),
            enabled: !!token, // Ensure token exists
        }),
        queryKey: getUsersQueryKey // Expose queryKey for invalidation
    };
}

// This hook can serve for GetMe by passing the logged-in user's ID.
export const useGetUser = (id: string | null) => {
    const { token } = useAppSelector(x => x.profileReducer);

    return {
        ...useQuery({
            queryKey: [getUserQueryKey, token, id], // Specific key for this user
            queryFn: async () => await getFactory(token).apiUserGetByIdIdGet({id: id ?? ""}),
            enabled: !isEmpty(id) && !!token, // Only run if id and token are present
        }),
        queryKey: getUserQueryKey // Generic key for invalidation by type
    };
}

export const useAddUser = () => { // Used by Admin typically
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [addUserMutationKey, token],
        mutationFn: async (userAddDTO: UserAddDTO) => {
            const result = await getFactory(token).apiUserAddPost({ userAddDTO });
            // Invalidate the paged list of users
            await queryClient.invalidateQueries({queryKey: [getUsersQueryKey]});
            return result;
        }
    })
}

export const useUpdateUser = () => { // For profile updates
    const { token, userId } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [updateUserMutationKey, token],
        mutationFn: async (userUpdateDTO: UserUpdateDTO) => {
            const result = await getFactory(token).apiUserUpdatePut({ userUpdateDTO });
            // Invalidate the current user's data
            await queryClient.invalidateQueries({ queryKey: [getUserQueryKey, token, userId] });
            // If admins can update other users, you might need more specific invalidation
            // or invalidate the general getUsersQueryKey if names/emails change in a list.
            return result;
        }
    });
};

export const useDeleteUser = () => { // Used by Admin typically
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [deleteUserMutationKey, token],
        mutationFn: async (id: string) => {
            const result = await getFactory(token).apiUserDeleteIdDelete({ id });
            await queryClient.invalidateQueries({queryKey: [getUsersQueryKey]});
            // Also invalidate specific user query if it was fetched
            await queryClient.invalidateQueries({queryKey: [getUserQueryKey, token, id]});
            return result;
        }
    })
}

export const useGetAllSitters = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    return useQuery({
        queryKey: [getAllSittersQueryKey, token],
        queryFn: () => getFactory(token).apiUserGetAllSittersGet(),
        enabled: !!token,
    });
};