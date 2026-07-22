import parse from "html-react-parser";

export default function Footer({ markup }) {
  return parse(markup);
}
