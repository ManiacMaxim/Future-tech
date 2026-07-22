import parse from "html-react-parser";

export default function PageContent({ markup }) {
  return parse(markup);
}
