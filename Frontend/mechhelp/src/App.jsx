import "./App.css";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Services from "./Pages/Services";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignUp from "./components/Signup";
import MechanicDashboard from "./components/MechanicDashboard"; // Import the new component

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SignUp />,
    },
    {
      path: "/layout",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "services",
          element: <Services />,
        }
      ],
    },
    // Add the new route for mechanic dashboard
    {
      path: "/mechanic-dashboard",
      element: <MechanicDashboard />,
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;