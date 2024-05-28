import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import Register from "./pages/register/Register";

const routes = createBrowserRouter(
  [
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