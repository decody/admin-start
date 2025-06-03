import { Link } from "react-router-dom";

export default function LocalMenu() {
  return (
    <div>
      <nav className="app-nav">
        <Link to="/">Home</Link>
        <Link to="/signup">회원가입</Link>
        <Link to="/grid">AgGrid 예제</Link>
        <Link to="/detail">상세보기</Link>
        <Link to="/content">컨텐츠</Link>
        <Link to="/formtable">폼 테이블</Link>
        <Link to="/validation">폼 테이블 검증</Link>
        <Link to="/i18n-example">다국어</Link>
      </nav>
    </div>
  );
}
