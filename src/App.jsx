import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import LocalMenu from "./components/common/LocalMenu";
// import { Outlet } from "react-router-dom";
import AppRoutes from "./AppRoutes";

export default function App() {
  return (
    <div className="app-layout">
      <Header isMain={true} />
      <div className="app-container">
        <LocalMenu />
        <AppRoutes />
      </div>
      <Footer isMain={true} />
    </div>
  );
}
