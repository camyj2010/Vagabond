import {createBrowserRouter} from "react-router-dom";
import Login from "./pages/login/Login";
import MyTrips from "./pages/myTrips/MyTrips";
import App from "./App";
import Register from "./pages/register/Register";

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
    {
      path: '/register',
      element: <Register/>
    },
		{
			path: '/',
			element: <App/>
		}
  ]
);

export default routes;