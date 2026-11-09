import { formatPostDate } from '@portfolio/lib/date';

export interface PostMetaProps {
  date: string;
  readingMinutes: number;
  className?: string;
}

/** `31 Jan 2026 · 3 min read` */
const PostMeta = ({ date, readingMinutes, className }: PostMetaProps) => (
  <span className={className}>
    <time dateTime={date}>{formatPostDate(date)}</time> · {readingMinutes} min read
  </span>
);

export default PostMeta;
