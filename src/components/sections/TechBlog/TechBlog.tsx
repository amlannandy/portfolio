import PostList from '@portfolio/components/ui/PostList';

import type { BlogConfig, PostSummary } from '@portfolio/types/post';

export interface TechBlogProps {
  posts: PostSummary[];
  blog: BlogConfig;
}

const TechBlog = ({ posts, blog }: TechBlogProps) => (
  <section aria-label="Tech writeups">
    <PostList posts={posts} basePath={blog.path} emptyMessage={blog.emptyMessage} />
  </section>
);

export default TechBlog;
