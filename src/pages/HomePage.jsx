import DocumentPage from "../components/DocumentPage";
import htmlDocument from "../content/home.html?raw";
import { preload } from "react-dom";

preload("/images/hero/resources-preview-bg.webp", {
  as: "image",
  fetchPriority: "high",
  media: "(min-width: 64rem)",
});
preload("/images/hero/resources-preview-bg-mobile.webp", {
  as: "image",
  fetchPriority: "high",
  media: "(max-width: 63.99875rem)",
});

export default function HomePage() {
  return <DocumentPage htmlDocument={htmlDocument} eagerImageCount={4} />;
}
