import {createBrowserRouter} from "react-router-dom";
import Login from "./pages/login/Login";
import MyTrips from "./pages/myTrips/MyTrips";
import App from "./App";
import Register from "./pages/register/Register";
import NewTrip from "./pages/newTrip/NewTrip";

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
		},
		{
			path: '/new_trip',
			element: <NewTrip/>
		}
  ]
);

export default routes;