import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from 'notistack';


const initialStateTerms = {
    Terms: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllTerms = createAsyncThunk(
    "Terms/getAllTerms",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getAllTermsCondition`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const createTerms = createAsyncThunk(
    "Terms/createTerms",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/createTermsCondition`, data);
            enqueueSnackbar(response.data.message || "Terms and Condition Add successful", { variant: "success" });
            return response.data.data;
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Terms and Condition not successful create", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const updateTerms = createAsyncThunk(
    "Terms/updateTerms",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/updateTermsCondition/${data._id}`, data.values);
            console.log(response.data);
            enqueueSnackbar(response.data.message || "Terms and Condition Update successful", { variant: "success" });
            return response.data.data; // Return the updated starring data
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Terms and Condition not update", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteTerms = createAsyncThunk(
    "Terms/deleteTerms",
    async (data, { dispatch, rejectWithValue }) => {
        console.log(data);

        try {
            const response = await axiosInstance.delete(`/deleteTermsCondition/${data._id}`);
            enqueueSnackbar(response.data.message || "Terms and Condition Delete successful", { variant: "success" });
            console.log(response.data);
            if (response.data.success) {
                return data._id;
            }
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Terms and Condition not Delete", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const TermsSlice = createSlice({
    name: 'Terms',
    initialState: initialStateTerms,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllTerms.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(getAllTerms.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Terms fetched successfully';
                state.Terms = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllTerms.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })

            .addCase(createTerms.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(createTerms.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Terms created successfully';
                state.Terms.push(action.payload);
            })
            .addCase(createTerms.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            .addCase(updateTerms.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(updateTerms.fulfilled, (state, action) => {
                console.log(action.payload);
                state.loading = false;
                state.success = true;
                state.message = 'Terms update successfully';
                state.Terms = state.Terms.map((v) => v._id == action.payload._id ? action.payload : v);
            })
            .addCase(updateTerms.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            .addCase(deleteTerms.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(deleteTerms.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Terms delete successfully';
                state.Terms = state.Terms.filter((v) => v._id !== action.payload);
            })
            .addCase(deleteTerms.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })

    }
});

export default TermsSlice.reducer;