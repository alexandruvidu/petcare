import { LoginDTO, RegisterDTO } from "../client/models"; // Added RegisterDTO
import { AuthorizationApi } from "../client/apis";
import {useMutation} from "@tanstack/react-query";

/**
 * Use constants to identify mutations and queries.
 */
const loginMutationKey = "loginMutation";
const registerMutationKey = "registerMutation";


/**
 * Returns the object with the callbacks that can be used for the React Query API, in this case just to log in the user.
 */
export const useLogin = () => {
    return useMutation({ // Return the mutation object.
        mutationKey: [loginMutationKey], // Add the key to identify the mutation.
        mutationFn: (loginDTO: LoginDTO) => new AuthorizationApi().apiAuthorizationLoginPost({ loginDTO }) // Add the mutation callback by using the generated client code and adapt it.
    })
}

/**
 * Returns the object with the callbacks that can be used for the React Query API for user registration.
 */
export const useRegister = () => {
    return useMutation({
        mutationKey: [registerMutationKey],
        mutationFn: (registerDTO: RegisterDTO) => new AuthorizationApi().apiAuthorizationRegisterPost({ registerDTO })
    })
}