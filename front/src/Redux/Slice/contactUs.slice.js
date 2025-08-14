import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from 'notistack';


const initialStatecontactUs = {
    contactUs: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllcontactUs = createAsyncThunk(
    "contactUs/getAllcontactUs",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getAllContactUs`);            
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const createcontactUs = createAsyncThunk(
    "contactUs/createcontactUs",
    async (data, { dispatch, rejectWithValue }) => {
        console.log(data);

        try {
            const response = await axiosInstance.post(`/createContactUs`, data);
            enqueueSnackbar(response.data.message || "Contact Add successful", { variant: "success" });
            return response.data;
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Contact not successful", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const updatecontactUs = createAsyncThunk(
    "contactUs/updatecontactUs",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/updateContactUs/${data._id}`, data);
            enqueueSnackbar(response.data.message || "Contact Updated successful", { variant: "success" });
            return response.data;
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Contact not Updated", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deletecontactUs = createAsyncThunk(
    "contactUs/deletecontactUs",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/deleteContactUs/${data._id}`);
            enqueueSnackbar(response.data.message || "Contact Delete successful", { variant: "success" });
            if (response.data.success) {
                return data._id;
            }
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Contact not Deleted", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const contactUsSlice = createSlice({
    name: 'contactUs',
    initialState: initialStatecontactUs,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllcontactUs.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching contactUs...';
            })
            .addCase(getAllcontactUs.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'contactUs fetched successfully';
                state.contactUs = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllcontactUs.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch contactUs';
            })

            .addCase(createcontactUs.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching contactUs...';
            })
            .addCase(createcontactUs.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'contactUs created successfully';
                state.contactUs = state.contactUs.push(action.payload);
            })
            .addCase(createcontactUs.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch contactUs';
            })
            .addCase(updatecontactUs.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching contactUs...';
            })
            .addCase(updatecontactUs.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'contactUs update successfully';
                state.contactUs = state.contactUs.map((v) => v._id === action.payload._id ? action.payload : v);
            })
            .addCase(updatecontactUs.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch contactUs';
            })
            .addCase(deletecontactUs.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching contactUs...';
            })
            .addCase(deletecontactUs.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'contactUs delete successfully';
                state.contactUs = state.contactUs.filter((v) => v._id !== action.payload);
            })
            .addCase(deletecontactUs.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch contactUs';
            })

    }
});

export default contactUsSlice.reducer;