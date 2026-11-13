import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/layout/SiteLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import AreaPage from "./pages/AreaPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route
            path="software-company-kolkata"
            element={<AreaPage path="/software-company-kolkata" />}
          />
          <Route
            path="website-development-maharashtra"
            element={<AreaPage path="/website-development-maharashtra" />}
          />
          {/* The separate order page was merged into Contact; keep old links working. */}
          <Route path="order" element={<Navigate to="/contact" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
