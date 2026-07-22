import DocumentPage from "../components/DocumentPage";
import htmlDocument from "../content/home.html?raw";

export default function HomePage() {
  return <DocumentPage htmlDocument={htmlDocument} />;
}
