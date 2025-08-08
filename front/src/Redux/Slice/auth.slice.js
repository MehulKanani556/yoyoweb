import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sessionStorage from "redux-persist/es/storage/session";
import axios from "axios";
import { BASE_URL } from "../../Utils/baseUrl";
// import { setAlert } from './alert.slice';
import { enqueueSnackbar } from "notistack";
// import { SocketContext } from '../../context/SocketContext';
// Remove direct usage of SocketContext()
// const { socket } = SocketContext();

const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";
  // dispatch(setAlert({ text: errorMessage, color: 'error' }));
  return rejectWithValue(error.response?.data || { message: errorMessage });
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  loggedIn: false,
  isLoggedOut: false,
  message: null,
  hasRedirected: false,
  loginLoadin: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/userLogin`, data, {
        withCredentials: true,
      });
      localStorage.setItem("yoyoToken", response.data.token);
      localStorage.setItem("yoyouserId", response.data.user._id);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("role", response.data.user?.role || "user");
      enqueueSnackbar(response.data.message || "Login successful", { variant: "success" });
      return response.data;
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Login failed", {
        variant: "error",
      });
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/createUser`, userData, {
        withCredentials: true,
      });
      localStorage.setItem('yoyoToken', response.data.token)
      localStorage.setItem('yoyouserId', response.data.user._id);
      localStorage.setItem('refreshToken', response.data.refreshToken)
      localStorage.setItem('role', response.data.user?.role || 'user');
      enqueueSnackbar(response.data.message || "Register successful", { variant: "success" });
      return response.data;
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Registration failed", {
        variant: "error",
      });
      return rejectWithValue(
        error.message || "An unknown error occurred during registration."
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/forgotPassword`, payload);
      if (response.status === 200) {
        // dispatch(setAlert({ text: response.data.message, color: 'success' }));
        enqueueSnackbar(response.data.message || "Forgot Password successful", {
          variant: "success",
        });
        return response.data;
      }
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/verifyOtp`, {
        email,
        otp
      });
      if (response.data.success) {
        enqueueSnackbar(
          response.data.message || "OTP verified successfully",
          { variant: "success" }
        );
        return response.data;
      }
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, newPassword }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/changePassword`, {
        email,
        newPassword,
      });
      if (response.status === 200) {
        // dispatch(setAlert({ text: response.data.message, color: 'success' }));
        enqueueSnackbar(response.data.message || "Password reset successful", {
          variant: "success",
        });
        return response.data;
      }
    } catch (error) {
      // return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/logout/${id}`);
      if (response.data.success) {
        localStorage.removeItem("yoyouserId");
        localStorage.removeItem("yoyoToken");
        localStorage.removeItem("role");
        if (window.persistor) {
          window.persistor.purge();
        }
        // dispatch(setAlert({ text: response.data.message, color: 'success' }));
        enqueueSnackbar(response.data.message || "Logged out successfully", { variant: "success" });
        return response.data;
      }
    } catch (error) {
      // return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // logout: (state, action) => {
    //     state.user = null;
    //     state.isAuthenticated = false;
    //     state.loggedIn = false;
    //     state.isLoggedOut = true;
    //     state.message = action.payload?.message || "Logged out successfully";
    //     window.localStorage.clear();
    //     window.sessionStorage.clear();
    // },
    setauth: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setHasRedirected: (state, action) => {
      state.hasRedirected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload && action.payload.user) {
          // Ensure user has a role property
          if (!action.payload.user.role) {
            action.payload.user.role = "user";
          }
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
          state.loginLoadin = false;
          state.message = action.payload?.message || "Login successfully";
        }
      })

      .addCase(login.pending, (state) => {
        state.loginLoadin = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginLoadin = false;
        state.error = action.payload.message;
        state.message = action.payload?.message
      })
      .addCase(register.fulfilled, (state, action) => {
        if (action.payload && action.payload.user) {
          // Ensure user has a role property
          if (!action.payload.user.role) {
            action.payload.user.role = "user";
          }
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
          state.message = action.payload?.message || "Register successfully";
        }
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "User Already Exist";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload; // Assuming the API returns a success message
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Forgot Password Failed";
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        if (action.payload && action.payload.user) {
          // Ensure user has a role property
          if (!action.payload.user.role) {
            action.payload.user.role = "user";
          }
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
        state.loading = false;
        state.error = null;
        state.message = action.payload.message; // Assuming the API returns a success message
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload.data?.message || "Verify OTP Failed";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload; // Assuming the API returns a success message
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Reset Password Failed";
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loggedIn = false;
        state.isLoggedOut = true;
        window.sessionStorage.clear();
        state.message = action.payload?.message || "Logged out successfully";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload.message;
        state.message = action.payload?.message || "Logout Failed";
      });
  },
});

export const { setauth, setHasRedirected } = authSlice.actions;
export default authSlice.reducer;
