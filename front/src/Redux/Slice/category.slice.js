import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from 'notistack';


const initialStateCategory = {
    categories: [],
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllCategories = createAsyncThunk(
    "category/getAllCategories",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getAllCategories`);
            return response.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const createCategory = createAsyncThunk(
    "category/createCategory",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/createCategory`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            enqueueSnackbar(response.data.message || "Category Add successful", { variant: "success" });
            return response.data;
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Category not successful", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/updateCategory/${data._id}`, data.formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            enqueueSnackbar(response.data.message || "Category Update successful", { variant: "success" });
            return response.data.data; // Return the updated category data
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Category not Updated", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/deleteCategory/${data._id}`);
            console.log(response.data);
            
            if (response.data.success) {
                return data._id;
            }
            enqueueSnackbar(response.data.message || "Category Delete successful", { variant: "success" });
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message || "Category not Deleted", { variant: "error" });
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const categorySlice = createSlice({
    name: 'category',
    initialState: initialStateCategory,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCategories.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Category fetched successfully';
                state.categories = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })

            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Category created successfully';
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Category update successfully';
                state.categories = state.categories.map((v) => v._id === action.payload._id ? action.payload : v);
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Category delete successfully';
                state.categories = state.categories.filter((v) => v._id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })

    }
});

export default categorySlice.reducer;