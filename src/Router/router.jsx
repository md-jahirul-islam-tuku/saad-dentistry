import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import ServicesDisplay from "../Layout/ServicesDisplay";
import AddService from "../Pages/AddService/AddService";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
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
import AllUsers from "../Pages/Dashboard/components/AllUsers";
import UserDetails from "../Pages/Dashboard/components/UserDetails";
import AllAppointments from "../Pages/Dashboard/components/AllAppointments";
import CheckoutForm from "../Pages/Dashboard/components/CheckoutForm";
import About from "../Pages/About/About";
import TermsOfUse from "../Pages/TermsOfUse/TermsOfUse";
import PrivacyPolicy from "../Pages/Privacy/PrivacyPolicy";
import FAQ from "../Pages/FAQ/FAQ";
import Contact from "../Pages/Contact/Contact";
import DashboardServices from "../Pages/Dashboard/components/DashboardServices";

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
        path: "/about",
        element: <About />,
      },
      {
        path: "/terms",
        element: <TermsOfUse />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/faq",
        element: <FAQ />,
      },
      {
        path: "/contact",
        element: <Contact />,
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
              fetch(
                `${process.env.REACT_APP_API_BASE_URL}/services/${params.id}`,
              ),
          },
        ],
      },
      {
        path: "/doctor/:doctorId",
        loader: async () => {
          const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/doctors-all`,
          );
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
              const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/doctors-all`,
              );
              return res.json();
            },
            hydrateFallbackElement: <h1>Loading ...</h1>,
            element: <Profile />,
          },
          {
            path: "pending-doctors",
            loader: async () => {
              const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/doctors-all`,
              );
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
              const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/doctors-all`,
              );
              return res.json();
            },
          },
          {
            path: "user-details/:id",
            element: (
              <AdminRoute>
                <UserDetails />
              </AdminRoute>
            ),
            loader: async () => {
              const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/users`,
                {
                  headers: {
                    authorization: `Bearer ${localStorage.getItem("saad-token")}`,
                  },
                },
              );
              return res.json();
            },
          },
          {
            path: "active-doctors",
            loader: async () => {
              const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/doctors-all`,
              );
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
              const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/doctors-all`,
              );
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
            element: (
              <AdminRoute>
                <AddService />
              </AdminRoute>
            ),
          },
          {
            path: "edit-service",
            element: (
              <AdminRoute>
                <DashboardServices />
              </AdminRoute>
            ),
          },
          {
            path: "all-appointments",
            element: (
              <AdminRoute>
                <AllAppointments />
              </AdminRoute>
            ),
          },
          {
            path: "users",
            loader: async () => {
              const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/users`,
                {
                  headers: {
                    authorization: `Bearer ${localStorage.getItem("saad-token")}`,
                  },
                },
              );
              return res.json();
            },
            hydrateFallbackElement: <h1>Loading ...</h1>,
            element: (
              <AdminRoute>
                <AllUsers />
              </AdminRoute>
            ),
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "my-appointments",
            element: <AllAppointments />,
          },
          {
            path: "payment/:id",
            element: <CheckoutForm />,
          },
        ],
      },
    ],
  },
]);

export default router;
