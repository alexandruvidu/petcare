import { useAppSelector } from "@application/store"
import { Configuration, SitterProfileApi } from "../client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { isEmpty } from "lodash"

/**
 * Use constants to identify mutations and queries.
 */
const getSitterProfilesQueryKey = "getSitterProfilesQuery"
const getSitterProfileQueryKey = "getSitterProfileQuery"
const addSitterProfileMutationKey = "addSitterProfileMutation"
const updateSitterProfileMutationKey = "updateSitterProfileMutation"
const deleteSitterProfileMutationKey = "deleteSitterProfileMutation"

const getFactory = (token: string | null) => new SitterProfileApi(new Configuration({ accessToken: token ?? "" }))

export const useGetSitterProfiles = (page: number, pageSize: number, search = "") => {
  const { token } = useAppSelector((x) => x.profileReducer)

  return {
    ...useQuery({
      queryKey: [getSitterProfilesQueryKey, token, page, pageSize, search],
      queryFn: async () => await getFactory(token).apiSitterProfileGetPageGet({ page, pageSize, search }),
      refetchInterval: Number.POSITIVE_INFINITY,
      refetchOnWindowFocus: false,
    }),
    queryKey: getSitterProfilesQueryKey,
  }
}

export const useGetSitterProfile = (id: string | null) => {
  const { token } = useAppSelector((x) => x.profileReducer)

  return {
    ...useQuery({
      queryKey: [getSitterProfileQueryKey, token, id],
      queryFn: async () => await getFactory(token).apiSitterProfileGetByIdIdGet({ id: id ?? "" }),
      refetchInterval: Number.POSITIVE_INFINITY,
      refetchOnWindowFocus: false,
      enabled: !isEmpty(id),
    }),
    queryKey: getSitterProfileQueryKey,
  }
}

export const useAddSitterProfile = () => {
  const { token } = useAppSelector((x) => x.profileReducer)
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [addSitterProfileMutationKey, token],
    mutationFn: async (sitterProfileAddDTO: any) => {
      const result = await getFactory(token).apiSitterProfileAddPost({ sitterProfileAddDTO })
      await queryClient.invalidateQueries({ queryKey: [getSitterProfilesQueryKey] })
      await queryClient.invalidateQueries({ queryKey: [getSitterProfileQueryKey] })

      return result
    },
  })
}

export const useUpdateSitterProfile = () => {
  const { token } = useAppSelector((x) => x.profileReducer)
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [updateSitterProfileMutationKey, token],
    mutationFn: async ({ id, sitterProfileUpdateDTO }: { id: string; sitterProfileUpdateDTO: any }) => {
      const result = await getFactory(token).apiSitterProfileUpdateIdPut({ id, sitterProfileUpdateDTO })
      await queryClient.invalidateQueries({ queryKey: [getSitterProfilesQueryKey] })
      await queryClient.invalidateQueries({ queryKey: [getSitterProfileQueryKey] })

      return result
    },
  })
}

export const useDeleteSitterProfile = () => {
  const { token } = useAppSelector((x) => x.profileReducer)
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [deleteSitterProfileMutationKey, token],
    mutationFn: async (id: string) => {
      const result = await getFactory(token).apiSitterProfileDeleteIdDelete({ id })
      await queryClient.invalidateQueries({ queryKey: [getSitterProfilesQueryKey] })
      await queryClient.invalidateQueries({ queryKey: [getSitterProfileQueryKey] })

      return result
    },
  })
}
