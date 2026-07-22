import DocumentPage from "../components/DocumentPage";
import htmlDocument from "../content/resources.html?raw";

export default function ResourcesPage() {
  return <DocumentPage htmlDocument={htmlDocument} eagerImageCount={2} />;
}
