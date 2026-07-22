export const pageLoaders = {
  home: () => import("./pages/HomePage"),
  news: () => import("./pages/NewsPage"),
  podcasts: () => import("./pages/PodcastsPage"),
  resources: () => import("./pages/ResourcesPage"),
  blog: () => import("./pages/BlogPage"),
  contacts: () => import("./pages/ContactsPage"),
};

const internalRoutes = new Map([
  ["/", { path: "/", preload: pageLoaders.home }],
  ["/index.html", { path: "/", preload: pageLoaders.home }],
  ["/news", { path: "/news", preload: pageLoaders.news }],
  ["/news.html", { path: "/news", preload: pageLoaders.news }],
  ["/podcasts", { path: "/podcasts", preload: pageLoaders.podcasts }],
  ["/podcasts.html", { path: "/podcasts", preload: pageLoaders.podcasts }],
  ["/resources", { path: "/resources", preload: pageLoaders.resources }],
  ["/resources.html", { path: "/resources", preload: pageLoaders.resources }],
  ["/blog", { path: "/blog", preload: pageLoaders.blog }],
  ["/blog.html", { path: "/blog", preload: pageLoaders.blog }],
  ["/contacts", { path: "/contacts", preload: pageLoaders.contacts }],
  ["/contacts.html", { path: "/contacts", preload: pageLoaders.contacts }],
]);

export const resolveInternalRoute = (href) => {
  if (!href) return null;

  const url = new URL(href, window.location.origin);
  if (url.origin !== window.location.origin || url.hash || url.search) {
    return null;
  }

  return internalRoutes.get(url.pathname) ?? null;
};
