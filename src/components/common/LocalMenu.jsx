import { Link } from "react-router-dom";

export default function LocalMenu() {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/grid">Grid</Link>
      </li>
      <li>
        <Link to="/detail">Detail</Link>
      </li>
      <li>
        <Link to="/content">Content</Link>
      </li>
    </ul>
  );
}
