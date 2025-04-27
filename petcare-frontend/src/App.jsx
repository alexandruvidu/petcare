import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Navbar from './components/layout/Navbar';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import PublicSitterReviews from './pages/sitter/PublicSitterReviews';

// Client Pages
import ClientDashboard from './pages/client/Dashboard';
import PetsTable from './pages/client/PetsTable';
import ClientBookingsTable from './pages/client/BookingsTable';
import SittersList from './pages/client/SittersList';

// Sitter Pages
import SitterDashboard from './pages/sitter/Dashboard';
import SitterBookingsView from './pages/sitter/SitterBookingsView';
import SitterReviews from './pages/sitter/SitterReviews';
import SitterProfile from './pages/sitter/SitterProfile';

// Common Pages
import ProfilePage from './pages/profile/ProfilePage';
// import FeedbackForm from './pages/feedback/FeedbackForm';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || !localStorage.getItem('token')) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sitter-reviews/:sitterId" element={<PublicSitterReviews />} />
            
            {/* Client Routes */}
            <Route 
              path="/client/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/client/pets" 
              element={
                <ProtectedRoute allowedRoles={['Client']}>
                  <PetsTable />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/client/bookings" 
              element={
                <ProtectedRoute allowedRoles={['Client']}>
                  <ClientBookingsTable />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sitters" 
              element={
                <ProtectedRoute allowedRoles={['Client']}>
                  <SittersList />
                </ProtectedRoute>
              } 
            />
            
            {/* Sitter Routes */}
            <Route 
              path="/sitter/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Sitter']}>
                  <SitterDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sitter/bookings" 
              element={
                <ProtectedRoute allowedRoles={['Sitter']}>
                  <SitterBookingsView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sitter/reviews" 
              element={
                <ProtectedRoute allowedRoles={['Sitter']}>
                  <SitterReviews />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['Client', 'Sitter']}>
                  {/* Conditionally render different profile components based on user role */}
                  {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === 'Sitter' 
                    ? <SitterProfile /> 
                    : <ProfilePage />
                  }
                </ProtectedRoute>
              } 
            />
            
            {/* Since we combined profiles, we reroute this to the main profile */}
            <Route 
              path="/sitter/profile" 
              element={
                <ProtectedRoute allowedRoles={['Sitter']}>
                  <Navigate to="/profile" replace />
                </ProtectedRoute>
              } 
            />
            
            {/* Common Routes */}
            {/* <Route path="/feedback" element={<FeedbackForm />} /> */}
            
            {/* Redirect to home for any unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="bg-gray-100 py-4 text-center text-gray-600">
          © {new Date().getFullYear()} PetCare. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;