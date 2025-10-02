import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AboutPage from '../containers/AboutPage';
import TeachingPage from '../containers/TeachingPage';
import CvPage from '../containers/CvPage';
import ContactPage from '../containers/ContactPage';
import HomePage from '../containers/HomePage';
import NotFoundPage from '../containers/NotFoundPage';
import LoginPage from '../components/LoginPage';
import SigninPage from '../components/SigninPage';
import PublicRoute from './PublicRoute';

const AppRouter: React.FC = () => (
  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/" element={<HomePage urlLang="he" />} />
      <Route path="/עב" element={<HomePage urlLang="he" />} />
      <Route path="/en" element={<HomePage urlLang="en" />} />
      <Route path="/אודות" element={<AboutPage urlLang="he" />} />
      <Route path="/About" element={<AboutPage urlLang="en" />} />
      <Route path="/הוראה" element={<TeachingPage urlLang="he" />} />
      <Route path="/Teaching" element={<TeachingPage urlLang="en" />} />
      <Route path="/קורות_חיים" element={<CvPage urlLang="he" />} />
      <Route path="/CV" element={<CvPage urlLang="en" />} />
      <Route path="/צרו_קשר" element={<ContactPage />} />
      <Route path="/Contact" element={<ContactPage />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/login" element={<PublicRoute redirectTo="/" />}>
        <Route index element={<LoginPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default AppRouter;
