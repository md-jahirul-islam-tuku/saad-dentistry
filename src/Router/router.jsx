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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/blog',
        element: <Blog />
      },
      {
        path: '/myreviews',
        element: <PrivateRoute><MyReviews /></PrivateRoute>
      },
      {
        path: '/reviews/:id',
        element: <EditReview />,
        loader: ({ params }) => fetch(`http://localhost:5000/reviews/${params.id}`)
      },
      {
        path: '/add-service',
        element: <PrivateRoute><AddService /></PrivateRoute>
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <SignUp />
      },
      {
        path: '/services',
        element: <ServicesDisplay />,
        children: [
          {
            path: '/services',
            element: <ServicesAll />
          },
          {
            path: '/services/:id',
            element: <ServiceDetails />,
            loader: ({ params }) => fetch(`http://localhost:5000/services/${params.id}`)
          }
        ]
      },
    ]
  }
])

export default router;