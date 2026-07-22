import parse from "html-react-parser";

export default function Header({ markup }) {
  return parse(markup);
}
