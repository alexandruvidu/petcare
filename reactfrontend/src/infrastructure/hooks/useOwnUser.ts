import { useAppSelector } from "@application/store";
import { UserRoleEnum } from "@infrastructure/apis/client";

/**
 * Retrieves the current user's basic information from the Redux profile state.
 */
export const useOwnUser = () => {
    const profile = useAppSelector(x => x.profileReducer);
    return {
        id: profile.userId,
        name: profile.name,
        email: profile.email, // Added email for completeness
        role: profile.role   // Role is now directly from Redux state
    };
};

/**
 * Checks if the current user has a specific role.
 * Relies on the 'role' field in the Redux profile state.
 */
export const useOwnUserHasRole = (roleToCheck: UserRoleEnum) => {
    const { role } = useAppSelector(x => x.profileReducer);
    return role === roleToCheck;
};

/**
 * This hook returns if the JWT token has expired or not.
 */
export const useTokenHasExpired = () => {
    const { loggedIn, exp } = useAppSelector(x => x.profileReducer);
    const now = Date.now() / 1000;

    return {
        loggedIn,
        hasExpired: !loggedIn || !exp || exp < now // Also consider !loggedIn as expired/invalid
    };
};