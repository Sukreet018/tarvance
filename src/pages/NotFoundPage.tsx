
import { Link } from "react-router-dom";
import { button } from "../components/ui/button";

export default function NotFoundPage() {
  return (
    <section className="site-container flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="eyebrow">404 · Page not found</p>
      <h1 className="display-heading mt-5 text-5xl text-tar-navy">
        We can’t find that page.
      </h1>
      <p className="mt-4 max-w-lg text-slate-600">
        The link might be broken, or the page may have moved.
      </p>
      <Link className={button("primary", "md", "mt-7")} to="/">
         Back to home
      </Link>
    </section>
  );
}
