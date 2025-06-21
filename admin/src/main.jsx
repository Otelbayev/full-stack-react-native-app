import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import AdminLayout from "./components/layout";
import Home from "./pages/home";
import Train from "./pages/train";
import Vagons from "./pages/vagons";
import Login from "./pages/login";
import Stations from "./pages/stations";
import R from "./pages/route";
import "antd/dist/reset.css";
import "leaflet/dist/leaflet.css";
import Search from "./pages/search";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Login />,
    },
    {
      element: <AdminLayout />,
      children: [
        { path: "/home", element: <Home /> },
        { path: "/train", element: <Train /> },
        { path: "/route", element: <R /> },
        { path: "/vagons", element: <Vagons /> },
        { path: "/stations", element: <Stations /> },
        { path: "/search", element: <Search /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
