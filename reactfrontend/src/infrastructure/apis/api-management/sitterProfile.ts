import { useAppSelector } from "@application/store";
import { Configuration, SitterProfileApi, SitterProfileAddDTO, SitterProfileUpdateDTO } from "../client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const sitterProfileApiQueryKeys = {
    myProfile: "getMySitterProfileQuery",
    sitterProfileById: "getSitterProfileByIdQuery",
} as const;

const sitterProfileApiMutationKeys = {
    addProfile: "addSitterProfileMutation",
    updateProfile: "updateSitterProfileMutation",
} as const;

const getFactory = (token: string | null) => new SitterProfileApi(new Configuration({ accessToken: token ?? "" }));

export const useGetMySitterProfile = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    return useQuery({
        queryKey: [sitterProfileApiQueryKeys.myProfile, token],
        queryFn: () => getFactory(token).apiSitterProfileMyProfileGet(),
        enabled: !!token,
    });
};

export const useGetSitterProfileById = (sitterId: string | null | undefined) => {
    const { token } = useAppSelector(x => x.profileReducer);
    return useQuery({
        queryKey: [sitterProfileApiQueryKeys.sitterProfileById, token, sitterId],
        queryFn: () => getFactory(token).apiSitterProfileGetSitterIdGet({ sitterId: sitterId ?? "" }),
        enabled: !!token && !!sitterId,
    });
};

export const useAddSitterProfile = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [sitterProfileApiMutationKeys.addProfile],
        mutationFn: (sitterProfileAddDTO: SitterProfileAddDTO) =>
            getFactory(token).apiSitterProfileAddPost({ sitterProfileAddDTO }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [sitterProfileApiQueryKeys.myProfile] });
        },
    });
};

export const useUpdateSitterProfile = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [sitterProfileApiMutationKeys.updateProfile],
        mutationFn: (sitterProfileUpdateDTO: SitterProfileUpdateDTO) => // The API takes the Sitter ID from the JWT
            getFactory(token).apiSitterProfileUpdatePut({ sitterProfileUpdateDTO }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [sitterProfileApiQueryKeys.myProfile] });
        },
    });
};