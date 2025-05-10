import type { RegisterDTO } from "../client/models"
import { AuthorizationApi } from "../client/apis"
import { useMutation } from "@tanstack/react-query"

/**
 * Use constants to identify mutations and queries.
 */
const registerMutationKey = "registerMutation"

/**
 * Returns the object with the callbacks that can be used for the React Query API for user registration.
 */
export const useRegister = () => {
  return useMutation({
    mutationKey: [registerMutationKey],
    mutationFn: (registerDTO: RegisterDTO) => new AuthorizationApi().apiAuthorizationRegisterPost({ registerDTO }),
  })
}
