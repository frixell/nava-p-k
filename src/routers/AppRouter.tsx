import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoadingScreen from '../components/common/LoadingScreen';
import PublicRoute from './PublicRoute';

const AboutPage = lazy(() => import('../containers/AboutPage'));
const TeachingPage = lazy(() => import('../containers/TeachingPage'));
const CvPage = lazy(() => import('../containers/CvPage'));
const ContactPage = lazy(() => import('../containers/ContactPage'));
const HomePage = lazy(() => import('../containers/HomePage'));
const NotFoundPage = lazy(() => import('../containers/NotFoundPage'));
const LoginPage = lazy(() => import('../components/LoginPage'));
const SigninPage = lazy(() => import('../components/SigninPage'));

type LazyComponent<T = Record<string, unknown>> = React.LazyExoticComponent<React.ComponentType<T>>;

interface LocalizedRoute<TProps = Record<string, unknown>> {
  paths: string[];
  component: LazyComponent<TProps>;
  props?: TProps;
}

const localizedRoutes: LocalizedRoute[] = [
  {
    paths: ['/', '/עב'],
    component: HomePage,
    props: { urlLang: 'he' }
  },
  {
    paths: ['/en'],
    component: HomePage,
    props: { urlLang: 'en' }
  },
  {
    paths: ['/אודות'],
    component: AboutPage,
    props: { urlLang: 'he' }
  },
  {
    paths: ['/About'],
    component: AboutPage,
    props: { urlLang: 'en' }
  },
  {
    paths: ['/הוראה'],
    component: TeachingPage,
    props: { urlLang: 'he' }
  },
  {
    paths: ['/Teaching'],
    component: TeachingPage,
    props: { urlLang: 'en' }
  },
  {
    paths: ['/קורות_חיים'],
    component: CvPage,
    props: { urlLang: 'he' }
  },
  {
    paths: ['/CV'],
    component: CvPage,
    props: { urlLang: 'en' }
  },
  {
    paths: ['/צרו_קשר', '/Contact'],
    component: ContactPage
  }
];

const AppRouter: React.FC = () => (
  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {localizedRoutes.flatMap(({ paths, component: Component, props }) =>
          paths.map((path) => (
            <Route key={path} path={path} element={<Component {...(props ?? {})} />} />
          ))
        )}
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/login" element={<PublicRoute redirectTo="/" />}>
          <Route index element={<LoginPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </Router>
);

export default AppRouter;
