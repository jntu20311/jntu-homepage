import { Markdown } from "@/shared/ui/markdown";
import privacyPolicy from "@/shared/assets/privacy-policy.md?raw";

export const PrivacyPage = () => {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Markdown>{privacyPolicy}</Markdown>
    </section>
  );
};
