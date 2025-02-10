import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import Signup from "../pages/Authorization/signup";
import OtpVerification from '../pages/Authorization/otpVerification';
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
import CatalogDetails from '../pages/Catalog/catalogDetails';
import AadharUpload from '../pages/Kyc/aadharUpload';
import InvestmentDetails from '../pages/Investments/viewnvestmetDetails';
import PanUpload from '../pages/Kyc/panUpload';
import SelfieUpload from '../pages/Kyc/selfieUpload';
import ChequeUpload from '../pages/Kyc/uploadCheque';
import BankDetails from '../pages/BankDetails/page';
import EditBankDetails from '../pages/BankDetails/editBankDetails';
import AddNominee from '../pages/BankDetails/nominee';
import EditNominee from '../pages/BankDetails/editNominee';
import ConsentForm from '../pages/Kyc/consentForm';
import SplashScreen from '../pages/Splash/page';
import ViewDetails from '../pages/BankDetails/viewDetails';
import GlobalHeader from '../components/Navbar/mobileView';

const routes = [
  { path: "/", element: <OtpVerification /> },
  { path: "/splash", element: <SplashScreen /> },
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
  { path: "/catalogs/catalog-details", element: <CatalogDetails /> },
  { path: "/kyc/aadhar-card-upload", element: <AadharUpload /> },
  { path: "/dashboard/investment-details", element: <InvestmentDetails /> },
  { path: "/kyc/pan-card-upload", element: <PanUpload /> },
  { path: "/kyc/selfie-upload", element: <SelfieUpload /> },
  { path: "/kyc/cancelled-checque-upload", element: <ChequeUpload /> },
  { path: "/profile-and-settings/bank-details", element: <BankDetails /> },
  { path: "/profile-and-settings/edit-bank-details", element: <EditBankDetails /> },
  { path: "/profile-and-settings/add-nominee", element: <AddNominee /> },
  { path: "/profile-and-settings/edit-nominee", element: <EditNominee /> },
  { path: "/kyc-status/consent-form", element: <ConsentForm /> },
  { path: "/profile-and-settings/view-bank-details", element: <ViewDetails /> },
];

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideSidebarRoutes = ["/", "/register", "/edit-customer-details", "/profile-and-settings/bank-details", "/profile-and-settings/edit-bank-details", "/profile-and-settings/edit-nominee", "/profile-and-settings/add-nominee", "/profile-and-settings/view-bank-details"]
  const isSidebarHidden = hideSidebarRoutes.includes(location.pathname);

  const showNavMobile = ["/catalogs", "/dashboard", "/payouts"]
  const isNavShow = showNavMobile.includes(location.pathname);

  useEffect(() => {
    const customerDetails = localStorage.getItem("customerDetails");
    const publicRoutes = ["/", "/register"];
    if (customerDetails && publicRoutes.includes(location.pathname)) {
      navigate("/catalogs");
    }

  }, [location, navigate]);

  return (
    <div className="App">
      {!isSidebarHidden && <Sidebar />}
      {isNavShow && <GlobalHeader />}
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
