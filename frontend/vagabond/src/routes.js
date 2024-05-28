import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import Register from "./pages/register/Register";
import NewTrip from "./pages/newTrip/NewTrip";

const routes = createBrowserRouter(
  [
    {
      path: '/register',
      element: <Register/>
    },
		{
			path: '/',
			element: <App/>
		},
		{
			path: '/newTrip',
			element: <NewTrip/>
		}
  ]
);

export default routes;