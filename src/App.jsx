import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { pageRoutes } from "./routing";

const pages = pageRoutes.map((route) => ({
  ...route,
  Component: lazy(route.preload),
}));

export default function App() {
  return (
    <Routes>
      {pages.flatMap(({ paths, Component }) =>
        paths.map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={null}>
                <Component />
              </Suspense>
            }
          />
        )),
      )}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
