import { markdownToHtml } from "@/lib/markdown";

export default async function Post({ params }) {
  const { slug } = params;
  const content = await fetchPostContent(slug);
  const htmlContent = await markdownToHtml(content);

  return (
    <article className="prose lg:prose-xl mx-auto">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </article>
  );
}
