import DocumentPage from "../components/DocumentPage";
import htmlDocument from "../content/blog.html?raw";

export default function BlogPage() {
  return <DocumentPage htmlDocument={htmlDocument} />;
}
