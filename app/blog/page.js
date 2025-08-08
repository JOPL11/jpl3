'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import MouseGradient from '../components/MouseGradient';

// This would typically come from a CMS or markdown files
const posts = [
  {
    id: 'first-post',
    title: 'Glassfinder App Update',
    date: '2025-08-08',
    excerpt: 'This is my first blog post. Welcome to my blog!',
  },
  {
    id: 'second-post',
    title: 'Glassmapper Dashboard Updates',
    date: '2025-08-09',
    excerpt: 'This is another blog post with more content.',
  },
];

export default function BlogPage() {
  return (
    <>
      <MouseGradient />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Image 
              src="/images/jp.svg" 
              alt="JPL Logo" 
              width={40} 
              height={40} 
              className={styles.logo}
            />
            <h1 className={styles.title}>devBlog</h1>
          </div>
          <Link href="/" className={styles.backButton}>
            ← Back to Portfolio
          </Link>
        </div>
        <div className={styles.posts}>
          {posts.map((post) => (
            <article key={post.id} className={styles.post}>
              <h2>
                <Link href={`/blog/${post.id}`} className={styles.postLink}>
                  {post.title}
                </Link>
              </h2>
              <time dateTime={post.date} className={styles.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <p className={styles.excerpt}>{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
