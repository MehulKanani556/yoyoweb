import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";

// GET ALL GAMES
export const getAllGames = createAsyncThunk(
  "game/getAllGames",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/getAllGames");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// CREATE GAME
export const createGame = createAsyncThunk(
  "game/createGame",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/createGame", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// UPDATE GAME
export const updateGame = createAsyncThunk(
  "game/updateGame",
  async ({ _id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/updateGame/${_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data; // controller returns { message, data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// DELETE GAME
export const deleteGame = createAsyncThunk(
  "game/deleteGame",
  async ({ _id }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/deleteGame/${_id}`);
      return { _id };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const gameSlice = createSlice({
  name: "game",
  initialState: {
    games: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearGameError: (state) => {
      state.error = null;
    },
    clearGameSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
      })
      .addCase(getAllGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // CREATE
      .addCase(createGame.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Game created successfully";
        state.games.unshift(action.payload); // add new game to top
      })
      .addCase(createGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPDATE
      .addCase(updateGame.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Game updated successfully";
        const idx = state.games.findIndex((g) => g._id === action.payload._id);
        if (idx !== -1) state.games[idx] = action.payload;
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // DELETE
      .addCase(deleteGame.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Game deleted successfully";
        state.games = state.games.filter((g) => g._id !== action.payload._id);
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGameError, clearGameSuccess } = gameSlice.actions;
export default gameSlice.reducer;
