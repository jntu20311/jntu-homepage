type Props = {
  content: string;
};

export const HTMLViewer = ({ content }: Props) => {
  return (
    <div
      className="ck prose prose-neutral max-w-none dark:prose-invert whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
