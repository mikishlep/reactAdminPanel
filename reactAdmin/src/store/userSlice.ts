import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    userName: string | null;
    firstName: string | null;
    lastName: string | null;
    accessToken: string | null;
    userId: string | null;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    userName: null,
    firstName: null,
    lastName: null,
    accessToken: null,
    userId: null,
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (
            state,
            action: PayloadAction<{
                userName: string;
                firstName: string;
                lastName: string;
                accessToken: string;
                userId: string;
            }>
        ) => {
            state.userName = action.payload.userName;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.accessToken = action.payload.accessToken;
            state.userId = action.payload.userId;
            state.isLoggedIn = true;

            localStorage.setItem("access_token", action.payload.accessToken);
            localStorage.setItem("userId", action.payload.userId);
            localStorage.setItem("isLoggedIn", "true");
        },
        logout: (state) => {
            state.userName = null;
            state.firstName = null;
            state.lastName = null;
            state.accessToken = null;
            state.userId = null;
            state.isLoggedIn = false;

            localStorage.removeItem("access_token");
            localStorage.removeItem("userId");
            localStorage.removeItem("isLoggedIn");
        },
        restoreSession: (state) => {
            const token = localStorage.getItem("access_token");
            const userId = localStorage.getItem("userId");
            const loggedIn = localStorage.getItem("isLoggedIn") === "true";

            if (token && userId && loggedIn) {
                state.accessToken = token;
                state.userId = userId;
                state.isLoggedIn = true;
            } else {
                state.isLoggedIn = false;
            }
        },
    },
});

export const { login, logout, restoreSession } = userSlice.actions;
export default userSlice.reducer;