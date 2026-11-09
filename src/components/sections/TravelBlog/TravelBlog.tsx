import PostList from '@portfolio/components/ui/PostList';

import type { BlogConfig, PostSummary } from '@portfolio/types/post';

export interface TravelBlogProps {
  posts: PostSummary[];
  blog: BlogConfig;
}

const TravelBlog = ({ posts, blog }: TravelBlogProps) => (
  <section aria-label="Travel stories">
    <PostList posts={posts} basePath={blog.path} emptyMessage={blog.emptyMessage} />
  </section>
);

export default TravelBlog;
