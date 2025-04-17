import { useEffect } from "react";
import { Routes as RouterRoutes, Route, useLocation } from "react-router-dom";
import { routes } from "configs/routes";

export default function AppRoutes() {
  const location = useLocation();
  useEffect(() => {}, [location.pathname]);

  return (
    <RouterRoutes>
      {routes.map((route) => {
        return (
          <Route key={route.label} path={route.link} element={route.element} />
        );
      })}
    </RouterRoutes>
  );
}
