import { useParams } from "react-router-dom";
import NotFound from "../NotFound";
import PersonPage from "./PersonPage";
import TitlePage from "./TitlePage";

export default function Details() {
  // Identity lives in the URL so every title page can be refreshed and shared
  const { type, id } = useParams<{ type: string; id: string }>();
  if (!/^\d+$/.test(id)) return <NotFound what="title" />;
  if (type === "person") return <PersonPage key={id} id={id} />;
  if (type === "movie" || type === "tv") return <TitlePage key={`${type}-${id}`} type={type} id={id} />;
  return <NotFound what="title" />;
}
