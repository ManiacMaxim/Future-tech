import DocumentPage from "../components/DocumentPage";
import htmlDocument from "../content/contacts.html?raw";

export default function ContactsPage() {
  return <DocumentPage htmlDocument={htmlDocument} />;
}
