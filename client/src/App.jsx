import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Patients from './Pages/Patients.jsx';
import AddPatient from './Pages/AddPatients.jsx';
import PatientDetails from './Pages/PatientDetails.jsx';
import Analytics from './Pages/Analytics.jsx';
import ImageAnalysis from './Pages/ImageAnalysis.jsx';
import Prediction from './Pages/Predictions.jsx';
import SymptomChecker from './Pages/SymptomChecker.jsx';
import Landing from './Pages/Landing.jsx';

const MainLayout = () => (
  <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
    <Navbar />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <SignedOut>
        <Routes>
          <Route path="/" element={
            <div className="h-screen overflow-y-auto mb-5 bg-slate-50 dark:bg-slate-900">
              <Navbar />
              <Landing />
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Redirect unauthorized access attempts to login */}
          <Route path="/dashboard" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SignedOut>
      <SignedIn>
        <Routes>
          {/* Landing page without Sidebar */}
          <Route path="/" element={
            <div className="h-screen overflow-y-auto mb-5 bg-slate-50 dark:bg-slate-900">
              <Navbar />
              <Landing />
            </div>
          } />
          
          {/* Main App Routes with Sidebar */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/add-patient" element={<AddPatient />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/image-analysis" element={<ImageAnalysis />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </SignedIn>
    </BrowserRouter>
  );
}

export default App;
