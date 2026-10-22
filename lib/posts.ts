import { supabase } from './supabase';

export interface Post {
  id: string;
  title: string;
  slug: string;
  markdown: string;
  published: boolean;
  tags: string[];
  created_at: string;
}

// Fetch all published posts for the homepage feed
export async function getPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data as Post[];
}

// Fetch a single post by slug for viewing
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  return data as Post;
}

// Insert a new post into the database
export async function createPost(title: string, markdown: string, tags: string[] = []) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const { data, error } = await supabase.from('posts').insert([
    {
      title,
      slug,
      markdown,
      tags,
      published: true,
    },
  ]);

  if (error) throw error;
  return data;
}