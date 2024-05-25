import {createBrowserRouter} from "react-router-dom";
import Login from "./pages/login/Login";

const routes = createBrowserRouter(
  [
    {
      path: '/',
      element: <Login />
    },
  ]
);

export default routes;