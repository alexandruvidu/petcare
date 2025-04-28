import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { ProfileState } from "./profileSlice.types";

/**
 * Use constants to identify keys in the local storage. 
 */
const tokenKey = "token";
const userKey = "user";

/**
 * This decodes the JWT token and returns the profile.
 */
const decodeToken = (token: string | null): ProfileState => {
  let decoded = token !== null ? jwtDecode<{ nameid: string, name: string, email: string, role: string, exp: number }>(token) : null;
  const now = Date.now() / 1000;
  let user = null;

  try {
    user = localStorage.getItem(userKey) ? JSON.parse(localStorage.getItem(userKey) as string) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  if (decoded?.exp && decoded.exp < now) {
    decoded = null;
    token = null;
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
  }

  return {
    loggedIn: token !== null,
    token: token ?? null,
    userId: decoded?.nameid ?? null,
    name: decoded?.name ?? null,
    email: decoded?.email ?? null,
    role: decoded?.role ?? null,
    exp: decoded?.exp ?? null,
    user: user
  };
};

/**
 * The reducer needs an initial state to avoid non-determinism.
 */
const getInitialState = (): ProfileState => decodeToken(localStorage.getItem(tokenKey));

/** 
 * The Redux slice for profile state
 */
export const profileSlice = createSlice({
  name: "profile",
  initialState: getInitialState(),
  reducers: {
    setToken: (_, action: PayloadAction<string>) => {
      localStorage.setItem(tokenKey, action.payload);
      return decodeToken(action.payload);
    },
    setUser: (state, action: PayloadAction<any>) => {
      localStorage.setItem(userKey, JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload
      };
    },
    resetProfile: () => {
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);

      return {
        loggedIn: false,
        token: null,
        userId: null,
        name: null,
        email: null,
        role: null,
        exp: null,
        user: null
      };
    }
  }
});

export const { 
  setToken,
  setUser,
  resetProfile
} = profileSlice.actions;

export const profileReducer = profileSlice.reducer;