import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import IDCreator from "./pages/IDCreator";

function App() {
  return (
    <BrowserRouter>

      <Sidebar />

      <div className="min-h-screen lg:pl-[80px]">

        <TopBar />

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/create"
            element={<IDCreator />}
          />

        </Routes>

        <Footer />

      </div>

    </BrowserRouter>
  );
}

export default App;