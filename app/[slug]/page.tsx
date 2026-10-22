import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug } from '@/lib/posts';
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | Cloud Blog Platform',
    };
  }

  return {
    title: `${post.title} | Cloud Blog Platform`,
    description: post.markdown.slice(0, 150).replace(/^[#*>\-`\s]+/gm, ''),
    keywords: post.tags,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/"
          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition inline-flex items-center gap-1"
        >
          &larr; Back to all posts
        </Link>

        <header className="border-b border-slate-800 pb-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-800"
              >
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {post.title}
          </h1>
          <p className="text-sm text-slate-500">
            Published on {new Date(post.created_at).toLocaleDateString()}
          </p>
        </header>

        <article className="prose prose-invert max-w-none text-slate-300 space-y-4 leading-relaxed font-sans">
          <ReactMarkdown>{post.markdown}</ReactMarkdown>
        </article>
      </div>
    </main>
  );
}