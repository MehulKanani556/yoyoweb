import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";

const initialStatedashboard = {
    topCategory: [],
    BasicCounts: {},
    totalRevenue: [],
    newPlan: [],
    mostWatched: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getBasicCounts = createAsyncThunk(
    "BasicCounts/getBasicCounts",
    async (filter = 'all', { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/dashboard?filter=${filter}`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const getTopCategory = createAsyncThunk(
    "TopCategory/getTopCategory",
    async (filter = 'all', { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/topCategories?filter=${filter}`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const getTotalRevenue = createAsyncThunk(
    "TotalRevenue/getTotalRevenue",
    async (filter = 'all', { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/totalRevenue?filter=${filter}`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const getnewSubscribersByPlan = createAsyncThunk(
    "newSubscribersByPlan/getnewSubscribersByPlan",
    async (filter = 'all', { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/newSubscribersByPlan?filter=${filter}`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const getmostWatched = createAsyncThunk(
    "mostWatched/getmostWatched",
    async (filter = 'all', { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/mostWatched?filter=${filter}`);
            return response.data.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: initialStatedashboard,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBasicCounts.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Basic Counts...';
            })
            .addCase(getBasicCounts.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Basic Counts fetched successfully';
                state.BasicCounts = action.payload || {};
            })
            .addCase(getBasicCounts.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch Basic Counts';
            })
            .addCase(getTopCategory.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Top Category...';
            })
            .addCase(getTopCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Top Category fetched successfully';
                state.topCategory = action.payload || {};
            })
            .addCase(getTopCategory.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch Top Category';
            })
            .addCase(getTotalRevenue.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching Total Revenue...';
            })
            .addCase(getTotalRevenue.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Total Revenue fetched successfully';
                state.totalRevenue = action.payload || {};
            })
            .addCase(getTotalRevenue.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch Total Revenue';
            })
            .addCase(getnewSubscribersByPlan.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching New Plan...';
            })
            .addCase(getnewSubscribersByPlan.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'New Plan fetched successfully';
                state.newPlan = action.payload || {};
            })
            .addCase(getnewSubscribersByPlan.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch New Plan';
            })
            .addCase(getmostWatched.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching New Plan...';
            })
            .addCase(getmostWatched.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'New Plan fetched successfully';
                state.mostWatched = action.payload || {};
            })
            .addCase(getmostWatched.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch New Plan';
            })
    }
});

export default dashboardSlice.reducer;