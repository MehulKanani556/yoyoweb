import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from 'notistack';


const initialStatepayment = {
    payment: [],
    success: false,
    message: '',
    loading: false,
    clientSecret: '',
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllpayment = createAsyncThunk(
    "payment/getAllpayment",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getpayment`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const getPaymentUser = createAsyncThunk(
    "payment/getPaymentUser",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getPaymentUser`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const createpayment = createAsyncThunk(
    "payment/createpayment",
    async (data, { dispatch, rejectWithValue }) => {
        console.log("rest", data);

        try {
            const response = await axiosInstance.post(`/create-payment`, data);
            enqueueSnackbar(response.data.message || "Payment Successful !", { variant: "success" });
            console.log("response", response.data);
            return response.data;
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "payment not successful", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState: initialStatepayment,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // getPayment
            .addCase(getAllpayment.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(getAllpayment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'payment fetched successfully';
                state.payment = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllpayment.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            // getPaymentUser
            .addCase(getPaymentUser.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(getPaymentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'payment fetched successfully';
                state.payment = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getPaymentUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            // create Payment
            .addCase(createpayment.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(createpayment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'payment created successfully';
                state.payment.push(action.payload.payment);
                state.clientSecret = action.payload.clientSecret;
            })
            .addCase(createpayment.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })

    }
});

export default paymentSlice.reducer;