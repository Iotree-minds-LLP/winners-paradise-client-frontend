import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "../App.css";
import Signup from "../pages/Authorization/signup";
import OtpVerification from '../pages/Authorization/otpVerification';
import HomePage from '../pages/Home/page';
import Notifications from '../pages/Notifications/listNotifications';
import ListInvestments from '../pages/Investments/listInvestments';
import Enquiry from '../pages/Enquiry/page';
import Catalogs from '../pages/Catalog/page';
import Kyc from '../pages/Kyc/kyc';
import Dashboard from '../components/Sidebar/page';
import Sidebar from '../components/Sidebar/page';
import MyProfile from '../pages/Profile/myProfileDetails';
import ProfileAndSettings from '../pages/Profile/profileAndSetting';
import EditCustomerProfile from '../pages/Profile/editMyProfileDetails';
import LanguagePreference from '../pages/Profile/languagePreference';
import DashboardPage from '../pages/Dashboard/page';
import Payouts from '../pages/payouts/page';
import KycStatusPage from '../pages/kycStatus/kyc';

const routes = [
  { path: "/", element: <OtpVerification /> },
  { path: "/register", element: <Signup /> },
  { path: "/edit-customer-details", element: <EditCustomerProfile /> },
  { path: "/homepage", element: <DashboardPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/my-profile", element: <MyProfile /> },
  { path: "/profile-and-settings", element: <ProfileAndSettings /> },
  { path: "/notifications", element: <Notifications /> },
  { path: "/my-investments", element: <ListInvestments /> },
  { path: "/payouts", element: <Payouts /> },
  { path: "/enquiry", element: <Enquiry /> },
  { path: "/catalogs", element: <Catalogs /> },
  { path: "/kyc", element: <Kyc /> },
  { path: "/Kyc-status", element: <KycStatusPage /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/update-language-preference", element: <LanguagePreference /> },
];

function AppLayout() {
  const location = useLocation();
  const hideSidebarRoutes = ["/", "/register", "/edit-customer-details"];

  const isSidebarHidden = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="App">
      {!isSidebarHidden && <Sidebar />}
      <div className={isSidebarHidden ? "content-full" : "content-wrapper"}>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </div>
  );
}

function RouterPage() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default RouterPage;
