import {createBrowserRouter} from "react-router-dom";
import Login from "./pages/login/Login";
import MyTrips from "./pages/myTrips/MyTrips";
import App from "./App";
import Register from "./pages/register/Register";
import NewTrip from "./pages/newTrip/NewTrip";
import Checklist from "./pages/myChecklist/Checklist";
import MyTrip from "./pages/myTrips/myTrip/MyTrip";
import FoodandMore from "./pages/myTrips/myTrip/FoodandMore";
import EditTrip from "./pages/myTrips/myTrip/EditTrip";

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
      path: '/my_trips/:id',
      element: <MyTrip/>
    },
		{
      path: '/my_trips/:id/foodandmore',
      element: <FoodandMore/>
    },
		{
      path: '/my_trips/:id/edit',
      element: <EditTrip/>
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
		},
    {
      path: '/my_checklist',
      element: <Checklist/>
    }
  ]
);

export default routes;