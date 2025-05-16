import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar1 from "./components/Navbar1";
import Navigator from "./components/Navigator";
import Landing from "./components/Landing";
import ContactUs from "./components/ContactUs";
import LoggedOut from "./components/LoggedOut";
import Feedback from "./components/Feedback";
import RatingInput from "./components/RatingInput";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext.jsx";
import ThankYou from "./components/ThankYou.jsx";
import Summarizer from "./components/Summariser.jsx";
import SummariesPage from "./components/SummariesPage.jsx";
import SummaryDetail from "./components/SummaryDetail.jsx";
import './App.css';

// Wrapper component to handle auth-dependent navigation
function AuthWrapper({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      navigate('/login');
    }
  }, [navigate]);

  return children;
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <AuthWrapper>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Navbar1 key={isAuthenticated ? 'auth' : 'no-auth'} />
          {isAuthenticated && <Navigator />}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/summarize" element={
                isAuthenticated ? <Summarizer /> : <Login />
              } />
              <Route path="/contact" element={<ContactUs/>}/>
              <Route path="/loggedOut" element={<LoggedOut/>}/>
              <Route path="/feedback" element={
                isAuthenticated ? <Feedback/> : <Login />
              }/>
              <Route path="/rating" element={
                isAuthenticated ? <RatingInput/> : <Login />
              }/>
              <Route path="/thankyou" element={<ThankYou/>}/>
              <Route path="/summaries" element={
                isAuthenticated ? <SummariesPage /> : <Login />
              }/>
              <Route path="/summaries/:id" element={
                isAuthenticated ? <SummaryDetail /> : <Login />
              }/>
            </Routes>
          </main>
          <Footer/>
        </div>
      </AuthWrapper>
    </Router>
  );
}

export default App;