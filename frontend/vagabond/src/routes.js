import {createBrowserRouter} from "react-router-dom";
import Login from "./pages/login/Login";
import MyTrips from "./pages/myTrips/MyTrips";

const routes = createBrowserRouter(
  [
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/my_trips',
      element: <MyTrips />
    },
  ]
);

export default routes;