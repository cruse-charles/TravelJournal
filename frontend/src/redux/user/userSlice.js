import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isLoading: false,
    error: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.isLoading = true;
        },
        signInSuccess: (state, action) => {
            state.isLoading = false;
            state.currentUser = action.payload;
            state.error = false;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
})

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

export default userSlice.reducer;