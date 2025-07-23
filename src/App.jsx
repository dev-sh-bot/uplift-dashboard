import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addUser } from "./reducers/authSlice";
import { useTheme } from "./hooks/useTheme";
import { useGlobalData } from "./hooks/useGlobalData";

import { LoadingSpinner } from "./components/Loaders";
import ProtectedRoute from "./components/ProtectedRoute";
import LogoutOverlay from "./components/LogoutOverlay";

// Lazy load components
const Layout = React.lazy(() => import("./components/Layout"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Login = React.lazy(() => import("./pages/Login"));
const RidersList = React.lazy(() => import("./pages/RidersList"));
const RiderView = React.lazy(() => import("./pages/RiderView"));
const VehicleTypeRateList = React.lazy(() => import("./pages/VehicleTypeRateList"));
const VehicleTypeRateForm = React.lazy(() => import("./pages/VehicleTypeRateForm"));
const CustomerList = React.lazy(() => import("./pages/CustomerList"));
const CustomerView = React.lazy(() => import("./pages/CustomerView"));
const Settings = React.lazy(() => import("./pages/Settings"));
const VehicleTypeRateView = React.lazy(() => import("./pages/VehicleTypeRateView"));
const SurgeRateList = React.lazy(() => import('./pages/SurgeRateList'));
const SurgeRateForm = React.lazy(() => import('./pages/SurgeRateForm'));
const SurgeRateView = React.lazy(() => import('./pages/SurgeRateView'));
const GeneralAnnouncementForm = React.lazy(() => import('./pages/GeneralAnnouncementForm'));
const GeneralAnnouncementList = React.lazy(() => import('./pages/GeneralAnnouncementList'));
const VehicleList = React.lazy(() => import('./pages/VehicleList'));
const VehicleView = React.lazy(() => import('./pages/VehicleView'));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <Dashboard />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "Dashboard"
    }
  },
  {
    path: "/riders",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <RidersList />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "Riders"
    }
  },
  {
    path: "/riders/:id",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <RiderView />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "Rider Details"
    }
  },
  {
    path: "/customers",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <CustomerList />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "Customers"
    }
  },
  {
    path: "/customers/:id",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <CustomerView />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "Customer Details"
    }
  },
  {
    path: "/vehicles",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <VehicleList />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "Vehicles"
    }
  },
  {
    path: "/vehicles/:id",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <VehicleView />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "Vehicle Details"
    }
  },
  {
    path: "/vehicle-type-rates",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <VehicleTypeRateList />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "Vehicle Type Rates"
    }
  },
  {
    path: "/vehicle-type-rates/add",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <VehicleTypeRateForm />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "Add Vehicle Type Rate"
    }
  },
  {
    path: "/vehicle-type-rates/edit/:id",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <VehicleTypeRateForm />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "Edit Vehicle Type Rate"
    }
  },
  {
    path: "/vehicle-type-rates/:id",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <VehicleTypeRateView />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "View Vehicle Type Rate"
    }
  },
  {
    path: "/surge-rates",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <SurgeRateList />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "Surge Rates"
    }
  },
  {
    path: "/surge-rates/create",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <SurgeRateForm />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "Create Surge Rate"
    }
  },
  {
    path: "/surge-rates/:id",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <SurgeRateView />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "View Surge Rate"
    }
  },
  {
    path: "/general-announcements",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <GeneralAnnouncementList />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "General Announcements"
    }
  },
  {
    path: "/general-announcement/create",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <GeneralAnnouncementForm />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "Create General Announcement"
    }
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Layout>
          <React.Suspense>
            <Settings />
          </React.Suspense>
        </Layout>
      </ProtectedRoute>
    ),
    handle: {
      title: "Settings"
    }
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute loggedIn={true}>
        <React.Suspense>
          <Login />
        </React.Suspense>
      </ProtectedRoute>
    )
  },
]);

const App = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const theme = useTheme(); // This will handle theme initialization
  // eslint-disable-next-line no-unused-vars
  const globalData = useGlobalData(); // This will handle global data initialization

  useEffect(() => {
    const fetchUser = async () => {
      let user;
      if (localStorage.getItem("user")) {
        user = JSON.parse(localStorage.getItem("user"));
      } else if (Cookies.get("user")) {
        user = JSON.parse(Cookies.get("user"));
      }
      if (user) {
        dispatch(addUser(user));
      } else {
        dispatch(addUser(null));
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <RouterProvider router={router} />
      <LogoutOverlay />
    </>
  );
};

export default App;