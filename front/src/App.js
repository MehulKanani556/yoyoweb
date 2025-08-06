import { Route, Routes } from "react-router-dom";
import "./App.css";
import { SnackbarProvider } from "notistack";

import { configureStore } from "./Redux/Store";
import { Provider } from "react-redux";
import UserRouts from "./routes/UserRouts";
import AdminRoutes from "./routes/AdminRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import UploadProgressBar from "./component/Common/UploadProgressBar";

const { store, persistor } = configureStore();
window.persistor = persistor;

function App() {
  // const navigate = useNavigate();
  // // const user = useSelector((state) => state.auth.user);
  // const role = localStorage.getItem('role');
  // const token = localStorage.getItem('ottToken');
  // const userId = localStorage.getItem('ottuserId');
  // const hasRedirected = sessionStorage.getItem('hasRedirected');

  // useEffect(() => {
  //   if (hasRedirected === 'true') return;
  //   if (token && userId) {
  //     if (role === 'admin') {
  //       sessionStorage.setItem('hasRedirected', 'true');
  //       navigate('/admin', { replace: true });
  //     } else {
  //       sessionStorage.setItem('hasRedirected', 'true');
  //       navigate('/', { replace: true });
  //     }
  //   }
  // }, []);

 

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          autoHideDuration={4000}
        >
          {/* <SocketProvider> */}
            <Routes>
              <Route path="/*" element={<UserRouts />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRole="admin">
                    {" "}
                    <AdminRoutes />{" "}
                  </ProtectedRoute>
                }
              />
            </Routes>
          {/* </SocketProvider> */}
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;

