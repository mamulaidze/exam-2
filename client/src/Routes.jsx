import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Header from "./components/Header";
import Home from "./pages/home";
import About from "./pages/About";
import Profile from "./pages/Profile";

export default function AppRoutes() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/profile"
          element={
            <>
              <SignedIn>
                <Profile />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </Router>
  );
}
