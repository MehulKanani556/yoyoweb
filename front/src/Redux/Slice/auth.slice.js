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
  loginLoadin:false,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ credentials, socket }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/userLogin`, credentials, {
        withCredentials: true,
      });

      // Check if 2-step verification is required
      if (response.data.requiresTwoStep) {
        localStorage.setItem("ottuserId", response.data.userId);
        return response.data
      }

      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("userId", response.data.user._id);
      localStorage.setItem("ottToken", response.data.token);
      localStorage.setItem("ottuserId", response.data.user._id);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("role", response.data.user?.role || "user");
      // dispatch(setAlert({ text: response.data.message, color: 'success' }));
      enqueueSnackbar(response.data.message || "Login successful", {
        variant: "success",
      });
      // socket?.emit("user-login", { userId: response.data.user._id, deviceId: getDeviceId(), deviceType: getDeviceType(), deviceName: getDeviceName() });
      // console.log("socket", socket);
      return response.data;
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Login failed", {
        variant: "error",
      });
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const verifyTwoStepOTP = createAsyncThunk(
    'auth/verifyTwoStepOTP',
    async ({ userId, otp,deviceId,deviceType,deviceName }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/verify-two-step`, {
                userId,
                otp,
                deviceId,
                deviceType,
                deviceName
            }, { withCredentials: true });

            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('userId', response.data.user._id);
            localStorage.setItem('ottToken', response.data.token)
            localStorage.setItem('ottuserId', response.data.user._id);
            localStorage.setItem('refreshToken', response.data.refreshToken)
            localStorage.setItem('role', response.data.user?.role || 'user');
            
            enqueueSnackbar(response.data.message || "2-step verification successful", { variant: "success" });
            return response.data;
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || "OTP verification failed", { variant: "error" });
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
      // sessionStorage.setItem('token', response.data.token);
      // sessionStorage.setItem('userId', response.data.user._id);
      // dispatch(setAlert({ text: response.data.message, color: 'success' }));
      enqueueSnackbar(response.data.message || "Register successful", {
        variant: "success",
      });

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
  async ({ phoneNo, otp, forgotPass }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/verifyOtp`, {
        phoneNo,
        otp,
        forgotPass,
      });
      if (forgotPass) {
        if (response.data.success) {
          enqueueSnackbar(
            response.data.message || "OTP verified successfully",
            { variant: "success" }
          );
          return response.data;
        }
      } else {
        if (response.data.success && response.data.token) {
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("userId", response.data.user._id);
          localStorage.setItem("ottToken", response.data.token);
          localStorage.setItem("ottuserId", response.data.user._id);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          localStorage.setItem("role", response.data.user?.role || "user");
          enqueueSnackbar(
            response.data.message || "OTP verified successfully",
            { variant: "success" }
          );
          return response.data;
        }
      }
    } catch (error) {
      return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { email, verifyPhone, newPassword },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${BASE_URL}/changePassword`, {
        email,
        verifyPhone,
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

export const googleLogin = createAsyncThunk(
  "auth/google-login",
  async (
    {
      uid,
      firstName,
      lastName,
      email,
      photo,
      gender,
      phoneNo,
      deviceId,
      deviceType,
      deviceName,
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/google-login`,
        {
          uid,
          firstName,
          lastName,
          email,
          photo,
          gender,
          phoneNo,
          deviceId,
          deviceType,
          deviceName,
        },
        { withCredentials: true }
      );
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("userId", response.data.user._id);

      localStorage.setItem("ottToken", response.data.token);
      localStorage.setItem("ottuserId", response.data.user._id);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("role", response.data.user?.role || "user");
      // enqueueSnackbar(response.data.message || "Google Login successful", { variant: "success" });
      return response.data;
    } catch (error) {
      // Optionally handle errors here
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const facebookLogin = createAsyncThunk(
  "auth/facebook-login",
  async ({ accessTokenf, userID }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/facebook-login`,
        { accessTokenf, userID },
        { withCredentials: true }
      );
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("userId", response.data.user._id);

      localStorage.setItem("ottToken", response.data.token);
      localStorage.setItem("ottuserId", response.data.user._id);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("role", response.data.user?.role || "user");
      enqueueSnackbar(response.data.message || "Facebook Login successful", {
        variant: "success",
      });
      return response.data;
    } catch (error) {
      // return handleErrors(error, dispatch, rejectWithValue);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/logout/${data.userId}`,
        data
      );
      if (response.status === 200) {
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("token");
        localStorage.removeItem("ottToken");
        localStorage.removeItem("ottuserId");
        localStorage.removeItem("role");
        localStorage.removeItem("hasRedirected");

        if (window.persistor) {
          window.persistor.purge();
        }
        // dispatch(setAlert({ text: response.data.message, color: 'success' }));
        enqueueSnackbar(response.data.message || "Logged out successfully", {
          variant: "success",
        });
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
      .addCase(login.rejected, (state,action) => {
          state.loginLoadin = false;
          state.error = action.payload.message;
          state.message = action.payload?.message
      })

      .addCase(verifyTwoStepOTP.fulfilled, (state, action) => {
        if (action.payload && action.payload.user) {
          // Ensure user has a role property
          if (!action.payload.user.role) {
            action.payload.user.role = "user";
          }
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
          state.message = action.payload?.message || "Login successfully";
        }
      })

      .addCase(verifyTwoStepOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Login Failed";
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
      .addCase(googleLogin.fulfilled, (state, action) => {
        if (action.payload && action.payload.user) {
          // Ensure user has a role property
          if (!action.payload.user.role) {
            action.payload.user.role = "user";
          }
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
          state.message = action.payload?.message || "Google Login successful";
        }
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Google Login Failed";
      })
      .addCase(facebookLogin.fulfilled, (state, action) => {
        if (action.payload && action.payload.user) {
          // Ensure user has a role property
          if (!action.payload.user.role) {
            action.payload.user.role = "user";
          }
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
          state.message =
            action.payload?.message || "Facebook Login successful";
        }
      })
      .addCase(facebookLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = action.payload?.message || "Facebook Login Failed";
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
