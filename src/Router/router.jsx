import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import ServicesDisplay from "../Layout/ServicesDisplay";
import AddService from "../Pages/AddService/AddService";
import Blog from "../Pages/Blog/Blog";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import EditReview from "../Pages/Reviews/EditReview";
import MyReviews from "../Pages/Reviews/MyReviews";
import ServiceDetails from "../Pages/ServiceDetails/ServiceDetails";
import ServicesAll from "../Pages/ServicesAll/ServicesAll";
import SignUp from "../Pages/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import DoctorDetails from "../Pages/Doctor/DoctorDetails";
import BeDoctor from "../Pages/BeDoctor/BeDoctor";
import Dashboard from "../Pages/Dashboard/Dashboard";
import PendingDoctors from "../Pages/Dashboard/components/PendingDoctors";
import Profile from "../Pages/Dashboard/components/Profile";
import Settings from "../Pages/Dashboard/components/Settings";
import ActiveDoctors from "../Pages/Dashboard/components/ActiveDoctors";
import DashboardDoctorDetails from "../Pages/Dashboard/components/DashboardDoctorDetails";
import RejectedDoctors from "../Pages/Dashboard/components/RejectedDoctor";
import AdminRoute from "./AdminRoute";
import AuthRoute from "./AuthRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/myreviews",
        element: (
          <PrivateRoute>
            <MyReviews />
          </PrivateRoute>
        ),
      },
      {
        path: "/reviews/:id",
        element: <EditReview />,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/reviews/${params.id}`),
      },
      {
        path: "/add-service",
        element: <AddService />,
      },
      {
        path: "/login",
        element: (
          <AuthRoute>
            <Login />
          </AuthRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthRoute>
            <SignUp />
          </AuthRoute>
        ),
      },
      {
        path: "/services",
        element: <ServicesDisplay />,
        children: [
          {
            path: "/services",
            element: <ServicesAll />,
          },
          {
            path: "/services/:id",
            element: <ServiceDetails />,
            loader: ({ params }) =>
              fetch(`http://localhost:5000/services/${params.id}`),
          },
        ],
      },
      {
        path: "/doctor/:doctorId",
        loader: async () => {
          const res = await fetch("http://localhost:5000/lalumia");
          return res.json();
        },
        hydrateFallbackElement: <h1>Loading ...</h1>,
        element: <DoctorDetails />,
      },
      {
        path: "/be-doctor",
        element: <BeDoctor />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            loader: async () => {
              const res = await fetch("http://localhost:5000/lalumia");
              return res.json();
            },
            hydrateFallbackElement: <h1>Loading ...</h1>,
            element: <Profile />,
          },
          {
            path: "pending-doctors",
            loader: async () => {
              const res = await fetch("http://localhost:5000/lalumia");
              return res.json();
            },
            hydrateFallbackElement: <h1>Loading ...</h1>,
            element: (
              <AdminRoute>
                <PendingDoctors />
              </AdminRoute>
            ),
          },
          {
            path: "doctor-details/:id",
            element: (
              <AdminRoute>
                <DashboardDoctorDetails />
              </AdminRoute>
            ),
            loader: async () => {
              const res = await fetch("http://localhost:5000/lalumia");
              return res.json();
            },
          },
          {
            path: "active-doctors",
            loader: async () => {
              const res = await fetch("http://localhost:5000/lalumia");
              return res.json();
            },
            hydrateFallbackElement: <h1>Loading ...</h1>,
            element: (
              <AdminRoute>
                <ActiveDoctors />
              </AdminRoute>
            ),
          },
          {
            path: "rejected-doctors",
            loader: async () => {
              const res = await fetch("http://localhost:5000/lalumia");
              return res.json();
            },
            hydrateFallbackElement: <h1>Loading ...</h1>,
            element: (
              <AdminRoute>
                <RejectedDoctors />
              </AdminRoute>
            ),
          },
          {
            path: "add-service",
            element: <AddService />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
]);

export default router;
