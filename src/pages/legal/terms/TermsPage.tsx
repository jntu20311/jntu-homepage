import { Markdown } from "@/shared/ui/markdown";
import usePolicy from "@/shared/assets/use-policy.md?raw";

export const TermsPage = () => {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Markdown>{usePolicy}</Markdown>
    </section>
  );
};
