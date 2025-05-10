import { useAppSelector } from "@application/store"
import { Configuration, PetApi } from "../client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { isEmpty } from "lodash"

/**
 * Use constants to identify mutations and queries.
 */
const getPetsQueryKey = "getPetsQuery"
const getPetQueryKey = "getPetQuery"
const addPetMutationKey = "addPetMutation"
const updatePetMutationKey = "updatePetMutation"
const deletePetMutationKey = "deletePetMutation"

const getFactory = (token: string | null) => new PetApi(new Configuration({ accessToken: token ?? "" }))

export const useGetPets = (page: number, pageSize: number, search = "") => {
  const { token } = useAppSelector((x) => x.profileReducer)

  return {
    ...useQuery({
      queryKey: [getPetsQueryKey, token, page, pageSize, search],
      queryFn: async () => await getFactory(token).apiPetGetPageGet({ page, pageSize, search }),
      refetchInterval: Number.POSITIVE_INFINITY,
      refetchOnWindowFocus: false,
    }),
    queryKey: getPetsQueryKey,
  }
}

export const useGetPet = (id: string | null) => {
  const { token } = useAppSelector((x) => x.profileReducer)

  return {
    ...useQuery({
      queryKey: [getPetQueryKey, token, id],
      queryFn: async () => await getFactory(token).apiPetGetByIdIdGet({ id: id ?? "" }),
      refetchInterval: Number.POSITIVE_INFINITY,
      refetchOnWindowFocus: false,
      enabled: !isEmpty(id),
    }),
    queryKey: getPetQueryKey,
  }
}

export const useAddPet = () => {
  const { token } = useAppSelector((x) => x.profileReducer)
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [addPetMutationKey, token],
    mutationFn: async (petAddDTO: any) => {
      const result = await getFactory(token).apiPetAddPost({ petAddDTO })
      await queryClient.invalidateQueries({ queryKey: [getPetsQueryKey] })
      await queryClient.invalidateQueries({ queryKey: [getPetQueryKey] })

      return result
    },
  })
}

export const useUpdatePet = () => {
  const { token } = useAppSelector((x) => x.profileReducer)
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [updatePetMutationKey, token],
    mutationFn: async ({ id, petUpdateDTO }: { id: string; petUpdateDTO: any }) => {
      const result = await getFactory(token).apiPetUpdateIdPut({ id, petUpdateDTO })
      await queryClient.invalidateQueries({ queryKey: [getPetsQueryKey] })
      await queryClient.invalidateQueries({ queryKey: [getPetQueryKey] })

      return result
    },
  })
}

export const useDeletePet = () => {
  const { token } = useAppSelector((x) => x.profileReducer)
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [deletePetMutationKey, token],
    mutationFn: async (id: string) => {
      const result = await getFactory(token).apiPetDeleteIdDelete({ id })
      await queryClient.invalidateQueries({ queryKey: [getPetsQueryKey] })
      await queryClient.invalidateQueries({ queryKey: [getPetQueryKey] })

      return result
    },
  })
}
