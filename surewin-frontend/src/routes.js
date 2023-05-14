import { Navigate, useRoutes } from "react-router-dom";
// layouts
import { useNavigate } from "react-router-dom";
//
import React, { Suspense } from "react";
import Loader from "./pages/Admin/Loader";

import NotFound from "./pages/Page404";
// import Register from "./pages/Register";

import DashboardApp from "./pages/Admin/DashboardApp";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import RequireAuth from "./routes/RequireAuth";
import AddInvoicePage from "./pages/Admin/AddInvoicePage";
import SingleStaffPage from "./pages/Admin/SingleStaffPage";

const Login = React.lazy(() => import("./pages/Login.js"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const DashboardLayout = React.lazy(() => import("./layouts/dashboard"));
const Tenants = React.lazy(() => import("./pages/Admin/TenantsPage"));
const AddTenant = React.lazy(() => import("./pages/Admin/AddTenantPage"));
const SingleUnit = React.lazy(() => import("./pages/Admin/SingleUnitPage"));
const SingleTenantPage = React.lazy(() =>
  import("./pages/Admin/SingleTenantPage")
);
const ManageUserPage = React.lazy(() => import("./pages/Admin/ManageUserPage"));
const AddStaffPage = React.lazy(() => import("./pages/Admin/AddStaffPage"));
const Units = React.lazy(() => import("./pages/Admin/UnitsPage"));
const AddUnit = React.lazy(() => import("./pages/Admin/AddUnitPage"));
const Transactions = React.lazy(() => import("./pages/Admin/TransactionPage"));
const AddTransactionPage = React.lazy(() =>
  import("./pages/Admin/AddTransactionPage")
);
const ReportsPage = React.lazy(() => import("./pages/Admin/ReportsPage"));
const AddParkingCollectionPage = React.lazy(() =>
  import("./pages/Admin/AddParkingCollectionPage")
);
const SettingsPage = React.lazy(() => import("./pages/Admin/SettingsPage"));
const SingleInvoicePage = React.lazy(() =>
  import("./pages/Admin/SingleInvoicePage")
);
const ArchivePage = React.lazy(() => import("./pages/Admin/ArchivePage"));
const SingleTransactionPage = React.lazy(() =>
  import("./pages/Admin/SingleTransactionPage")
);
const Utilities = React.lazy(() => import("./pages/Admin/UtilitiesPage"));
// ----------------------------------------------------------------------

export default function Router() {
  const navigate = useNavigate();
  return useRoutes([
    {
      path: "/",
      element: <ProtectedRoutes />,
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<Loader />}>
              <DashboardLayout />
            </Suspense>
          ),
          children: [
            { path: "/", element: <Navigate to="/dashboard" /> },
            { path: "dashboard", element: <DashboardApp /> },
            {
              path: "tenants",
              element: <RequireAuth role={["admin"]} />,
              children: [
                { index: true, element: <Tenants /> },
                { path: "/tenants/add", element: <AddTenant /> },
                { path: "/tenants/:id", element: <SingleTenantPage /> },
              ],
            },
            {
              path: "utilities",
              element: <RequireAuth role={["admin"]} />,
              children: [{ index: true, element: <Utilities /> }],
            },
            {
              path: "staff",
              element: <RequireAuth role={["admin"]} />,
              children: [
                { index: true, element: <ManageUserPage /> },
                { path: "/staff/add", element: <AddStaffPage /> },
                { path: "/staff/:id", element: <SingleStaffPage /> },
              ],
            },
            {
              path: "property-units",
              element: <RequireAuth role={["admin"]} />,
              children: [
                { index: true, element: <Units /> },
                { path: "/property-units/add", element: <AddUnit /> },
                { path: "/property-units/:id", element: <SingleUnit /> },
              ],
            },
            {
              path: "payments",
              element: <RequireAuth role={["admin"]} />,
              children: [{ index: true, element: <Transactions /> }],
            },
            {
              path: "transactions",
              element: <RequireAuth role={["admin"]} />,
              children: [
                { index: true, element: <Navigate to="/payments" /> },
                { path: "/transactions/add", element: <AddTransactionPage /> },
                { path: ":id", element: <SingleTransactionPage /> },
                {
                  path: "/transactions/parking_collections/add",
                  element: <AddParkingCollectionPage />,
                },
              ],
            },
            {
              path: "invoices",
              element: <RequireAuth role={["admin"]} />,
              children: [
                { index: true, element: <Navigate to="/payments" /> },
                {
                  path: "/invoices/add",
                  element: <AddInvoicePage />,
                },
                { path: ":id", element: <SingleInvoicePage /> },
              ],
            },
            {
              path: "settings",
              element: <RequireAuth role={["admin"]} />,
              children: [{ index: true, element: <SettingsPage /> }],
            },
            {
              path: "reports",
              element: <RequireAuth role={["admin"]} />,
              children: [{ index: true, element: <ReportsPage /> }],
            },
            {
              path: "archive_contracts",
              element: <RequireAuth role={["admin"]} />,
              children: [{ index: true, element: <ArchivePage /> }],
            },
            {
              path: "unauthorized",
              element: (
                <div>
                  <button onClick={() => navigate("/")}>Go Back</button>
                </div>
              ),
            },
          ],
        },
      ],
    },
    {
      path: "login",
      element: (
        <Suspense fallback={<Loader />}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: "forgotpassword",
      element: (
        <Suspense fallback={<Loader />}>
          <ForgotPassword />
        </Suspense>
      ),
    },
    {
      path: "resetpassword/:id/:token",
      element: (
        <Suspense fallback={<Loader />}>
          <ResetPassword />
        </Suspense>
      ),
    },
    {
      path: "loader",
      element: (
        <Suspense fallback={<Loader />}>
          <Loader />
        </Suspense>
      ),
    },
    // {
    //   path: "register",
    //   element: <Register />,
    // },

    { path: "404", element: <NotFound /> },
    { path: "*", element: <Navigate to="/404" /> },

    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);
}
