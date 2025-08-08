'use client';

import Link from 'next/link';
import styles from './page.module.css';
import MouseGradient from '../../components/MouseGradient';

export default function BlogPostContent({ post }) {
  if (!post) {
    return null;
  }

  return (
    <>
      <MouseGradient />
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <time dateTime={post.date} className={styles.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <div className={styles.divider2}></div>
        </header>
        
        <div className={styles.content}>
          {post.content}
        </div>
        
        <footer className={styles.footer}>
          <div className={styles.divider2}></div>
          <Link href="/blog" className={styles.backLink}>
            &larr; Back to all posts
          </Link>
        </footer>
      </article>
    </>
  );
}
