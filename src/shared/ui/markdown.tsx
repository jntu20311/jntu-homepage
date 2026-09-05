import ReactMarkdown from "react-markdown";
import { cn } from "@/shared/lib/utils";

interface MarkdownProps {
  children: string;
  className?: string;
}

export const Markdown = ({ children, className }: MarkdownProps) => {
  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none dark:prose-invert",
        className,
      )}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
};
