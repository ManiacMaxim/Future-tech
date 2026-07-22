import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const HomePage = lazy(() => import("./pages/HomePage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const PodcastsPage = lazy(() => import("./pages/PodcastsPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const ContactsPage = lazy(() => import("./pages/ContactsPage"));

const pages = [
  { paths: ["/", "/index.html"], Component: HomePage },
  { paths: ["/news", "/news.html"], Component: NewsPage },
  { paths: ["/podcasts", "/podcasts.html"], Component: PodcastsPage },
  { paths: ["/resources", "/resources.html"], Component: ResourcesPage },
  { paths: ["/blog", "/blog.html"], Component: BlogPage },
  { paths: ["/contacts", "/contacts.html"], Component: ContactsPage },
];

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
