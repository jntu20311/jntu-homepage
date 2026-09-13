type Props = {
  content: string;
};

export const HTMLViewer = ({ content }: Props) => {
  return (
    <div
      className="ck prose prose-neutral max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
