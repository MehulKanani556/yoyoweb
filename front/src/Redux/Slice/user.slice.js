import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Utils/baseUrl";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from "notistack";
import { getCSRFToken } from "../../Utils/csrfUtils";
// import { setAlert } from "./alert.slice";

const initialStateUsers = {
  allusers: [],
  currUser: null,
  twoStepEnabled: false,
  success: false,
  message: "",
  loading: false,
  watchlist: [],
  devices: [],
  // screen time tracking state
  screenTimeRemaining: 0,
  screenTimeUsage: 0,
  screenTimeLimit: 0,
  screenTimeLoading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";
  // dispatch(setAlert({ text: errorMessage, color: 'error' }));
  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/allUsers");
      return response.data.user;
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, { dispatch, rejectWithValue }) => {
    console.log(id);
    try {
      const response = await axiosInstance.delete(`/deleteUser/${id}`);
      // dispatch(setAlert({ text: response.data.message, color: 'success' }));
      return id;
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, values, file }, { dispatch, rejectWithValue }) => {
    const token = await sessionStorage.getItem("token");
    const formData = new FormData();

    // Object.keys(values).forEach((key) => {
    //     if (values[key] !== null) {
    //         formData.append(key, values[key]);
    //     }
    // });

    // Append all form values to FormData
    Object.keys(values).forEach((key) => {
      if (values[key] !== null && values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    });

    if (file) {
      formData.append("photo", file);
    }

    try {
      const response = await axiosInstance.put(`/userUpdate/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      enqueueSnackbar(response.data.message || "User updated successfully", {
        variant: "success",
      });
      // dispatch(setAlert({ text: response.data.message, color: 'success' }));
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/getUserById/${id}`);
      // dispatch(setAlert({ text: response.data.message, color: 'success' }));
      // dispatch(getAllUsers());
      return response.data.user;
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "users/resetPassword",
  async (
    { email, oldPassword, newPassword },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/resetPassword`, {
        email,
        oldPassword,
        newPassword,
      });
      // dispatch(setAlert({ text: response.data.message, color: 'success' }));
      return response.data;
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const sendDeleteOtp = createAsyncThunk(
  "user/sendDeleteOtp",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/sendDeleteOtp`, payload);
      // dispatch(setAlert({ text: response.data.message, color: 'success' }));
      return response.data;
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const verifyDeleteOtp = createAsyncThunk(
  "user/verifyDeleteOtp",
  async (payload, { dispatch, rejectWithValue }) => {
    console.log("verify payload", payload);
    try {
      const response = await axiosInstance.post(`/verifyDeleteOtp`, payload);
      return response.data;
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  "user/addToWatchlist",
  async (movieId, { rejectWithValue }) => {
    try {
      const responce = await axiosInstance.post("/addToWatchlist", { movieId });

      if (responce.success) {
        return responce.data.watchlist;
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add to watchlist"
      );
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  "user/removeFromWatchlist",
  async (movieId, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/removeFromWatchlist", { movieId });
      return movieId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove from watchlist"
      );
    }
  }
);

export const fetchWatchlist = createAsyncThunk(
  "watchlist/fetchWatchlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/getWatchlist");
      console.log(response);

      return response.data.watchlist;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch watchlist"
      );
    }
  }
);

export const fetchdevices = createAsyncThunk(
  "devices/fetchdevices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/devices");
      return response.data.devices;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch watchlist"
      );
    }
  }
);

export const logoutDevice = createAsyncThunk(
  "devices/logoutDevice",
  async ({ deviceId, currentDeviceId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/logout-device", { deviceId });
      return {
        status: response.data.status,
        deviceId,
        currentDeviceId,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to logout device"
      );
    }
  }
);

// Enable TwoStep
export const enableTwoStep = createAsyncThunk(
  "user/enableTwoStep",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/enableTwoStep`, { email });
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

// Verify TwoStep
export const verifyTwoStep = createAsyncThunk(
  "user/verifyTwoStep",
  async ({ email, otp, enable }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/verifyTwoStep`, {
        email,
        otp,
        enable,
      });
      return response.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

// Get screen time remaining
export const getScreenTimeRemaining = createAsyncThunk(
  "user/getScreenTimeRemaining",
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/screenTimeRemaining/${userId}`
      );
      return response.data;
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

// Update screen time usage
export const updateScreenTimeUsage = createAsyncThunk(
  "user/updateScreenTimeUsage",
  async ({ userId, addMs }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/screenTimeUsage/${userId}`, {
        addMs,
      });
      return response.data;
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: initialStateUsers,
  reducers: {
    // Add reducer to reset screen time state
    resetScreenTimeState: (state) => {
      state.screenTimeRemaining = 0;
      state.screenTimeUsage = 0;
      state.screenTimeLimit = 0;
    },
    // Add reducer to update screen time locally (for real-time updates)
    updateScreenTimeLocally: (state, action) => {
      const { remaining, usage, limit } = action.payload;
      state.screenTimeRemaining = remaining;
      state.screenTimeUsage = usage;
      state.screenTimeLimit = limit;
    },
    userUpdateData: (state, action) => {
      if (state.currUser.email == action.payload.email) {
        state.currUser.subscribe = action.payload.subscribe
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.message = "Fetching users...";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Users fetched successfully";
        state.allusers = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to fetch users";
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.message = "Deleting user...";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.allusers = state.allusers.filter(
          (user) => user._id !== action.payload
        );
        state.message = action.payload?.message || "User deleted successfully";
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete user";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.message = "Editing user...";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.allusers = state.allusers.map((user) =>
          user._id === action.payload.user._id ? action.payload.user : user
        );
        state.currUser = action.payload.user;
        state.message = action.payload?.message || "User updated successfully";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to update user";
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.message = "Getting user...";
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currUser = action.payload;
        state.allusers = state.allusers.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to get user";
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.message = "Resetting password...";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Password reset successfully";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to reset password";
      })
      .addCase(sendDeleteOtp.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendDeleteOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload;
      })
      .addCase(sendDeleteOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Forgot Password Failed";
      })
      .addCase(verifyDeleteOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(verifyDeleteOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload.data?.message || "Verify OTP Failed";
      })

      // Add
      .addCase(addToWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.watchlist = action.payload;
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.watchlist = action.payload;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove
      .addCase(removeFromWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.watchlist = state.watchlist.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // devices
      .addCase(fetchdevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchdevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchdevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // enableTwoStep
      .addCase(enableTwoStep.pending, (state) => {
        state.loading = true;
      })
      .addCase(enableTwoStep.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(enableTwoStep.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Failed to send OTP";
      })
      // verifyTwoStep
      .addCase(verifyTwoStep.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyTwoStep.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // Update twoStepEnabled from backend response
        if (action.payload.user) {
          state.twoStepEnabled = action.payload.user.twoStepEnabled;
        }
      })
      .addCase(verifyTwoStep.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Failed to verify OTP";
      })

      // Screen time remaining cases
      .addCase(getScreenTimeRemaining.pending, (state) => {
        state.screenTimeLoading = true;
      })
      .addCase(getScreenTimeRemaining.fulfilled, (state, action) => {
        state.screenTimeLoading = false;
        state.screenTimeRemaining = action.payload.remaining;
        state.screenTimeUsage = action.payload.usage;
        state.screenTimeLimit = action.payload.limit;
      })
      .addCase(getScreenTimeRemaining.rejected, (state, action) => {
        state.screenTimeLoading = false;
        state.message =
          action.payload?.message || "Failed to get screen time remaining";
      })

      // Screen time usage update cases
      .addCase(updateScreenTimeUsage.pending, (state) => {
        state.screenTimeLoading = true;
      })
      .addCase(updateScreenTimeUsage.fulfilled, (state, action) => {
        state.screenTimeLoading = false;
        state.screenTimeRemaining = action.payload.remaining;
        state.screenTimeUsage = action.payload.usage;
        state.screenTimeLimit = action.payload.limit;

        // Check if limit is reached and show notification
        if (action.payload.remaining <= 0) {
          enqueueSnackbar("Daily screen time limit reached!", {
            variant: "warning",
            autoHideDuration: 5000,
          });
        }
      })
      .addCase(updateScreenTimeUsage.rejected, (state, action) => {
        state.screenTimeLoading = false;
        state.message =
          action.payload?.message || "Failed to update screen time usage";
      });
  },
});

export const { resetScreenTimeState, updateScreenTimeLocally, userUpdateData } =
  usersSlice.actions;
export default usersSlice.reducer;
