import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode, JwtPayload } from "jwt-decode"; // Import JwtPayload
import { UserDTO, UserRoleEnum } from "@infrastructure/apis/client";

const TOKEN_KEY = "token";
const USER_KEY = "user"; // Key for storing the UserDTO object

// Define the shape of the JWT payload we expect
interface DecodedToken extends JwtPayload {
  nameid?: string; // Standard claim for User ID
  name?: string;   // Standard claim for User's full name
  email?: string;
  role?: UserRoleEnum;
  // exp is already part of JwtPayload
}

export interface ProfileState {
  loggedIn: boolean;
  token: string | null;
  userId: string | null;
  name: string | null;
  email: string | null;
  role: UserRoleEnum | null;
  exp: number | null;
}

const getInitialState = (): ProfileState => {
  const token = localStorage.getItem(TOKEN_KEY);
  const storedUserJson = localStorage.getItem(USER_KEY);
  let user: UserDTO | null = null;

  if (storedUserJson) {
    try {
      user = JSON.parse(storedUserJson) as UserDTO;
    } catch (e) {
      console.error("Failed to parse stored user:", e);
      localStorage.removeItem(USER_KEY); // Clear invalid user data
    }
  }

  if (!token) {
    localStorage.removeItem(USER_KEY); // Ensure user is also cleared if no token
    return { loggedIn: false, token: null, userId: null, name: null, email: null, role: null, exp: null };
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Date.now() / 1000;

    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      console.warn("Token expired, clearing profile.");
      return { loggedIn: false, token: null, userId: null, name: null, email: null, role: null, exp: null };
    }

    // Prioritize user object from localStorage if available and consistent with token
    // This ensures role is correctly sourced from the initial login API response
    return {
      loggedIn: true,
      token: token,
      userId: user?.id || decoded?.nameid || null,
      name: user?.name || decoded?.name || null,
      email: user?.email || decoded?.email || null,
      role: user?.role || (decoded?.role as UserRoleEnum) || null, // Cast decoded role
      exp: decoded?.exp || null
    };

  } catch (error) {
    console.warn("Invalid token during initial state. Resetting profile:", error);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { loggedIn: false, token: null, userId: null, name: null, email: null, role: null, exp: null };
  }
};

export const profileSlice = createSlice({
  name: "profile",
  initialState: getInitialState(),
  reducers: {
    /**
     * Accepts an object containing the JWT token and the UserDTO.
     */
    setLoginData: (state, action: PayloadAction<{ token: string; user: UserDTO }>) => {
      const { token, user } = action.payload;

      if (!token || !user) {
        console.warn("Invalid token or user data passed to setLoginData");
        // Reset to initial (empty) state if data is bad
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return getInitialState();
      }

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user)); // Store the user object

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          console.warn("Expired token passed to setLoginData, resetting.");
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          return getInitialState();
        }

        // Update Redux state directly from API response and decoded token
        state.loggedIn = true;
        state.token = token;
        state.userId = user.id; // Prefer ID from UserDTO
        state.name = user.name;   // Prefer name from UserDTO
        state.email = user.email; // Prefer email from UserDTO
        state.role = user.role;   // Crucially, use role from UserDTO
        state.exp = decoded.exp || null;

      } catch (error) {
        console.error("Error decoding token in setLoginData:", error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return getInitialState();
      }
    },

    resetProfile: (state) => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      state.loggedIn = false;
      state.token = null;
      state.userId = null;
      state.name = null;
      state.email = null;
      state.role = null;
      state.exp = null;
    }
  }
});

export const { setLoginData, resetProfile } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;