import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import IDCreator from "./pages/IDCreator";

// Fade + slight rise/fall as pages swap, so navigating between
// "/" and "/create" doesn't feel like a hard cut.
function PageTransition({ children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -16 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/create"
          element={
            <PageTransition>
              <IDCreator />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Sidebar />

      <div className="min-h-screen lg:pl-[80px]">
        <TopBar />

        <AnimatedRoutes />

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;