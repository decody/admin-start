import Main from "pages/Main";
import AgGrid from "pages/AgGrid";
import Detail from "pages/Detail";
import Content from "pages/Content";
import SignUp from "pages/SignUp";
import SignIn from "pages/SignIn";
import FormTableExample from "pages/FormTableExample";
import NotFound from "pages/NotFound";

export const routes = [
  { label: "main", link: "/", element: <Main /> },
  { label: "grid", link: "/grid", element: <AgGrid /> },
  { label: "detail", link: "/detail", element: <Detail /> },
  { label: "content", link: "/content", element: <Content /> },
  { label: "signup", link: "/signup", element: <SignUp /> },
  { label: "signin", link: "/signin", element: <SignIn /> },
  { label: "formtable", link: "/formtable", element: <FormTableExample /> },
  { label: "notfound", link: "*", element: <NotFound /> },
];
