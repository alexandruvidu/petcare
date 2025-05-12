import { useAppSelector } from "@application/store";
import { Configuration, PetApi, PetAddDTO, PetUpdateDTO } from "../client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const petApiQueryKeys = {
    myPets: "getMyPetsQuery",
    petById: "getPetByIdQuery",
} as const;

const petApiMutationKeys = {
    addPet: "addPetMutation",
    updatePet: "updatePetMutation",
    deletePet: "deletePetMutation",
} as const;

const getFactory = (token: string | null) => new PetApi(new Configuration({ accessToken: token ?? "" }));

export const useGetMyPets = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    return useQuery({
        queryKey: [petApiQueryKeys.myPets, token],
        queryFn: () => getFactory(token).apiPetGetMyPetsGet(),
        enabled: !!token, // Only run if token exists
    });
};

export const useGetPetById = (id: string | null | undefined) => {
    const { token } = useAppSelector(x => x.profileReducer);
    return useQuery({
        queryKey: [petApiQueryKeys.petById, token, id],
        queryFn: () => getFactory(token).apiPetGetByIdIdGet({ id: id ?? "" }),
        enabled: !!token && !!id,
    });
};

export const useAddPet = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [petApiMutationKeys.addPet],
        mutationFn: (petAddDTO: PetAddDTO) => getFactory(token).apiPetAddPost({ petAddDTO }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [petApiQueryKeys.myPets] });
        },
    });
};

export const useUpdatePet = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [petApiMutationKeys.updatePet],
        mutationFn: (params: { id: string, petUpdateDTO: PetUpdateDTO }) =>
            getFactory(token).apiPetUpdateIdPut({ id: params.id, petUpdateDTO: params.petUpdateDTO }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [petApiQueryKeys.myPets] });
            queryClient.invalidateQueries({ queryKey: [petApiQueryKeys.petById, token, variables.id] });
        },
    });
};

export const useDeletePet = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [petApiMutationKeys.deletePet],
        mutationFn: (id: string) => getFactory(token).apiPetDeleteIdDelete({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [petApiQueryKeys.myPets] });
        },
    });
};