import { useAppSelector } from "@application/store"
import { Configuration, FeedbackApi } from "../client"
import { useMutation } from "@tanstack/react-query"

/**
 * Use constants to identify mutations and queries.
 */
const submitFeedbackMutationKey = "submitFeedbackMutation"

const getFactory = (token: string | null) => new FeedbackApi(new Configuration({ accessToken: token ?? "" }))

export const useSubmitFeedback = () => {
  const { token } = useAppSelector((x) => x.profileReducer)

  return useMutation({
    mutationKey: [submitFeedbackMutationKey, token],
    mutationFn: async (feedbackData: any) => {
      return await getFactory(token).apiFeedbackSubmitPost({ feedbackDTO: feedbackData })
    },
  })
}
