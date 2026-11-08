import { Route, Routes } from "react-router";
import ThemeProvider from "./context/ThemeProvider";
import FiltersProvider from "./context/FiltersProvider";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import CountryDetailsPage from "./pages/CountryDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
      <ThemeProvider>
        <FiltersProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="country/:code" element={<CountryDetailsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </FiltersProvider>
      </ThemeProvider>
  );
}