import { useEffect, useMemo } from "react";
import Footer from "./Footer";
import Header from "./Header";
import PageContent from "./PageContent";
import usePageInteractions from "../hooks/usePageInteractions";

const extract = (document, tag) =>
  document.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>[\\s\\S]*?</${tag}>`, "i"),
  )?.[0] ?? "";

const extractTitle = (document) =>
  document.match(/<title>(.*?)<\/title>/i)?.[1] ?? "Future Tech";

export default function DocumentPage({ htmlDocument, eagerImageCount = 0 }) {
  const page = useMemo(
    () => ({
      title: extractTitle(htmlDocument),
      header: extract(htmlDocument, "header"),
      main: extract(htmlDocument, "main"),
      footer: extract(htmlDocument, "footer"),
    }),
    [htmlDocument],
  );

  useEffect(() => {
    document.title = page.title;
  }, [page.title]);

  usePageInteractions();

  return (
    <>
      <Header markup={page.header} />
      <PageContent markup={page.main} eagerImageCount={eagerImageCount} />
      <Footer markup={page.footer} />
    </>
  );
}
