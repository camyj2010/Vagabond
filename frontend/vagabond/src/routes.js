import {createBrowserRouter} from "react-router-dom";
import Login from "./pages/login/Login";

const routes = createBrowserRouter(
  [
    {
      path: '/login',
      element: <Login />
    },
  ]
);

export default routes;