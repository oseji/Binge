import { toast } from "react-toastify";
import Icon from "./Icon";

/** Native share sheet where there is one (phones), otherwise copy the link */
export default function ShareButton({ title }: { title: string }) {
  const share = async () => {
    const url = window.location.href;
    if (navigator.share && matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title: `${title} on Binge`, url });
      } catch {
        /* dismissed */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <button type="button" className="btn btn-ghost" onClick={share}>
      <Icon name="link" size={18} />
      Share
    </button>
  );
}
