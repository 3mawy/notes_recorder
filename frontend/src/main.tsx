import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import { Provider } from "react-redux";
import { persistor, rootStore } from "./store/rootStore";
import { StrictMode } from "react";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import Loader from "./components/Loader";
import router from "./routes/routes";
import { RouterProvider } from "react-router-dom";

const renderApp = () => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
      <Provider store={rootStore}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} fallbackElement={<Loader />} />
        </PersistGate>
      </Provider>
    </StrictMode>,
  );
};
renderApp();
