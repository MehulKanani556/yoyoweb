import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from "notistack";

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/cart");
      return res.data.cart || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ gameId, platform, qty }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/cart/add", { gameId, platform, qty });
      enqueueSnackbar("Added to cart", { variant: "success" });
      return res.data.cart || [];
    } catch (err) {
      // Show specific warning for duplicate items
      if (err.response?.status === 400) {
        enqueueSnackbar(err.response?.data?.message || "Game already in cart for this platform", { variant: "warning" });
      } else if (err.response?.status === 401) {
        enqueueSnackbar("Please login first to add items to cart", { variant: "error" });
      } else {
        enqueueSnackbar(err.response?.data?.message || "Failed to add to cart", { variant: "error" });
      }
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async ({ gameId, platform, qty }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/cart/update", { gameId, platform, qty });
      return res.data.cart || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async ({ gameId, platform }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/cart/remove", { gameId, platform });
      enqueueSnackbar("Removed from cart", { variant: "success" });
      return res.data.cart || [];
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Failed to remove from cart", { variant: "error" });
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/cart/clear");
      return res.data.cart || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default cartSlice.reducer;


