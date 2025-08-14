import { combineReducers } from "redux";
import authSlice from "./Slice/auth.slice";
import userSlice from "./Slice/user.slice";
import categorySlice from "./Slice/category.slice";
import contactSlice from "./Slice/contactUs.slice";
import TermsSlice from "./Slice/TermsCondition.slice";
import policySlice from "./Slice/PrivacyPolicy.slice";
import dashboardSlice from "./Slice/dashboard.slice";
import paymentSlice from './Slice/Payment.slice';
import gameReducer from './Slice/game.slice';
import cartReducer from './Slice/cart.slice';


export const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  contactUs: contactSlice,
  category: categorySlice,
  term: TermsSlice,
  policy: policySlice,
  dashboard: dashboardSlice,
  payment: paymentSlice,
  game: gameReducer,
  cart: cartReducer,
});
