export const pageRoutes = [
  {
    id: "home",
    paths: ["/", "/index.html"],
    preload: () => import("./pages/HomePage"),
  },
  {
    id: "news",
    paths: ["/news", "/news.html"],
    preload: () => import("./pages/NewsPage"),
  },
  {
    id: "podcasts",
    paths: ["/podcasts", "/podcasts.html"],
    preload: () => import("./pages/PodcastsPage"),
  },
  {
    id: "resources",
    paths: ["/resources", "/resources.html"],
    preload: () => import("./pages/ResourcesPage"),
  },
  {
    id: "blog",
    paths: ["/blog", "/blog.html"],
    preload: () => import("./pages/BlogPage"),
  },
  {
    id: "contacts",
    paths: ["/contacts", "/contacts.html"],
    preload: () => import("./pages/ContactsPage"),
  },
];

const internalRoutes = new Map(
  pageRoutes.flatMap(({ paths, preload }) =>
    paths.map((pathname) => [pathname, { path: paths[0], preload }]),
  ),
);

export const resolveInternalRoute = (href) => {
  if (!href) return null;

  const url = new URL(href, window.location.origin);
  if (url.origin !== window.location.origin || url.hash || url.search) {
    return null;
  }

  return internalRoutes.get(url.pathname) ?? null;
};
