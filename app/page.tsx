'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPublishedPosts, createPost, Post } from '@/lib/posts';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const loadPosts = async () => {
    setFetching(true);
    const data = await getPublishedPosts();
    setPosts(data);
    setFetching(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !markdown.trim()) return;

    setLoading(true);
    try {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await createPost(title, markdown, tagList);
      setTitle('');
      setTags('');
      setMarkdown('');
      await loadPosts();
    } catch (err) {
      console.error(err);
      alert('Error creating post. Check browser console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Cloud Blog Platform
          </h1>
          <p className="mt-2 text-slate-400">
            Powered by Next.js App Router, Supabase PostgreSQL, and Markdown.
          </p>
        </header>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Write New Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My First Cloud Architecture Post"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="aws, serverless, database"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Content (Markdown supported)
              </label>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                rows={6}
                placeholder="Write your article here using **bold**, # headings, lists, or code blocks..."
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2.5 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Publishing...' : 'Publish Article'}
            </button>
          </form>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Recent Articles</h2>

          {fetching ? (
            <p className="text-slate-500">Loading articles from Supabase...</p>
          ) : posts.length === 0 ? (
            <p className="text-slate-500 italic">No published articles yet. Publish your first one above!</p>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-800"
                      >
                        #{tag}
                      </span>
                    ))}
                    <span className="text-xs text-slate-500 ml-auto">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <Link href={`/${post.slug}`}>
                    <h3 className="text-xl font-bold text-white hover:text-blue-400 transition cursor-pointer">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-slate-400 mt-2 line-clamp-2 text-sm">
                    {post.markdown.replace(/^[#*>\-`\s]+/gm, '')}
                  </p>

                  <div className="mt-4">
                    <Link
                      href={`/${post.slug}`}
                      className="text-sm font-semibold text-blue-400 hover:text-blue-300"
                    >
                      Read full article &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}