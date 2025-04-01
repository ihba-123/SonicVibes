import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import About from "./pages/Aboutus.tsx/About";
import SignUp from "./pages/Authentication/SignUp";
import SignIn from "./pages/Authentication/SignIn";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import Contact from "./pages/Contact/Contact";
import AuthProvider from "./providers/AuthProvider";

function App() {
  const { isSignedIn, isLoaded } = useAuth(); // Add isLoaded to wait for Clerk
  const isEmailPasswordLoggedIn = !!localStorage.getItem("token");
  const isLoggedIn = isSignedIn || isEmailPasswordLoggedIn;
  const navigate = useNavigate();

  useEffect(() => {
    console.log("App Route Check:", { isSignedIn, isEmailPasswordLoggedIn, isLoggedIn });

    // Only redirect if auth is loaded and user is not logged in
    if (!isLoaded) return; // Wait for Clerk to load

    const protectedPaths = ["/chat", "/admin"];
    const currentPath = window.location.pathname;

    if (!isLoggedIn && protectedPaths.some(path => currentPath.startsWith(path))) {
      navigate("/signin", { replace: true });
    }
  }, [isLoggedIn, isLoaded, navigate]);

  // If Clerk is still loading, don’t render routes yet
  if (!isLoaded) {
    return null; // Or a loading spinner: <div>Loading...</div>
  }

  return (
    <AuthProvider>
      <Routes>
        {/* SSO Callback Routes (always accessible) */}
        <Route
          path="/sso-callback"
          element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
        />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />

        {/* Protected Routes (only accessible if user is signed in) */}
        <Route path="/admin" element={isLoggedIn ? <AdminPage /> : <SignIn />} />

        {/* Public Routes (accessible to everyone, wrapped in MainLayout) */}
        <Route element={<MainLayout />}>
        <Route path="/chat" element={isLoggedIn ? <ChatPage /> : <SignIn />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Other Public Routes */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        {/* Authentication Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Redirect /dashboard to / */}
        <Route path="/dashboard" element={<HomePage />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;