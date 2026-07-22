import DocumentPage from "../components/DocumentPage";
import htmlDocument from "../content/podcasts.html?raw";

export default function PodcastsPage() {
  return <DocumentPage htmlDocument={htmlDocument} />;
}
