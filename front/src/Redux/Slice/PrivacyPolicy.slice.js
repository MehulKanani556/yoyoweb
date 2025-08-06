import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from 'notistack';

const initialStatePrivacy = {
    Privacy: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllPrivacy = createAsyncThunk(
    "Privacy/getAllPrivacy",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getAllprivacyPolicy`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const createPrivacy = createAsyncThunk(
    "Privacy/createPrivacy",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/createprivacyPolicy`, data);
            enqueueSnackbar(response.data.message || "Privacy Add successful", { variant: "success" });
            return response.data.data;
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Privacy not successful", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const updatePrivacy = createAsyncThunk(
    "Privacy/updatePrivacy",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/updateprivacyPolicy/${data._id}`, data.values);
            console.log(response.data);
            enqueueSnackbar(response.data.message || "Privacy Update successful", { variant: "success" });
            return response.data.data; // Return the updated starring data
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Privacy not Update", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deletePrivacy = createAsyncThunk(
    "Privacy/deletePrivacy",
    async (data, { dispatch, rejectWithValue }) => {
        console.log(data);

        try {
            const response = await axiosInstance.delete(`/deleteprivacyPolicy/${data._id}`);
            console.log(response.data);
            enqueueSnackbar(response.data.message || "Privacy Delete successful", { variant: "success" });
            if (response.data.success) {
                return data._id;
            }
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Privacy not Delete", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const PrivacySlice = createSlice({
    name: 'Privacy',
    initialState: initialStatePrivacy,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllPrivacy.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(getAllPrivacy.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Privacy fetched successfully';
                state.Privacy = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllPrivacy.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })

            .addCase(createPrivacy.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(createPrivacy.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Privacy created successfully';
                state.Privacy.push(action.payload);
            })
            .addCase(createPrivacy.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            .addCase(updatePrivacy.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(updatePrivacy.fulfilled, (state, action) => {
                console.log(action.payload);
                state.loading = false;
                state.success = true;
                state.message = 'Privacy update successfully';
                state.Privacy = state.Privacy.map((v) => v._id == action.payload._id ? action.payload : v);
            })
            .addCase(updatePrivacy.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            .addCase(deletePrivacy.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(deletePrivacy.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Privacy delete successfully';
                state.Privacy = state.Privacy.filter((v) => v._id !== action.payload);
            })
            .addCase(deletePrivacy.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })

    }
});

export default PrivacySlice.reducer;