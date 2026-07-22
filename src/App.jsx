import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { pageLoaders } from "./routing";

const HomePage = lazy(pageLoaders.home);
const NewsPage = lazy(pageLoaders.news);
const PodcastsPage = lazy(pageLoaders.podcasts);
const ResourcesPage = lazy(pageLoaders.resources);
const BlogPage = lazy(pageLoaders.blog);
const ContactsPage = lazy(pageLoaders.contacts);

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
