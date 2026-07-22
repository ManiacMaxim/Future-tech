import DocumentPage from "../components/DocumentPage";
import htmlDocument from "../content/news.html?raw";

export default function NewsPage() {
  return <DocumentPage htmlDocument={htmlDocument} />;
}
