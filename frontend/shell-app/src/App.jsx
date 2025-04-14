// shell-app/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, useLocation, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Login from 'authApp/Login';
import Register from 'authApp/Register';
import PatientDashboard from 'patientApp/PatientDashboard';
import NurseDashboard from 'nurseApp/NurseDashboard'
import VitalsForm from 'nurseApp/VitalsForm';
import PatientDetails from 'nurseApp/PatientDetails';
import AppNavbar from './Navbar';

const authClient = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  credentials: 'include',
  cache: new InMemoryCache(),
});

const patientClient = new ApolloClient({
  uri: 'http://localhost:4002/graphql',
  credentials: 'include',
  cache: new InMemoryCache(),
});

const nurseClient = new ApolloClient({
  uri: 'http://localhost:4003/graphql',
  credentials: 'include',
  cache: new InMemoryCache(),
});

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  // const role = localStorage.getItem('role');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/login', '/register'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);
  return (
    <>
      {shouldShowNavbar && <AppNavbar />}
      <Routes>
        <Route
          path="/"
          element={
            <ApolloProvider client={authClient}>
              <Login />
            </ApolloProvider>
          }
        />
        <Route
          path="/login"
          element={
            <ApolloProvider client={authClient}>
              <Login />
            </ApolloProvider>
          }
        />
        <Route
          path="/register"
          element={
            <ApolloProvider client={authClient}>
              <Register />
            </ApolloProvider>
          }
        />
        <Route
          path="/patient"
          element={
            <ProtectedRoute>
              <ApolloProvider client={patientClient}>
                <PatientDashboard />
              </ApolloProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse"
          element={
            <ApolloProvider client={nurseClient}>
              <NurseDashboard />
            </ApolloProvider>
          }
        />
        <Route
          path="/vitals-form"
          element={
            <ApolloProvider client={nurseClient}>
              <VitalsForm />
            </ApolloProvider>
          }
        />
        <Route
          path="/patient-details/:id"
          element={
            <ApolloProvider client={nurseClient}>
              <PatientDetails />
            </ApolloProvider>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
