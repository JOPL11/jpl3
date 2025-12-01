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
    date: '2025-07-20',
    excerpt: 'first',
  },
  {
    id: 'second-post',
    title: 'Glassmapper Dashboard Updates',
    date: '2025-08-05',
    excerpt: '2nd.',
  },
  {
    id: 'third-post',
    title: 'App Name Change',
    date: '2025-08-09',
    excerpt: '3rd.',
  },
  {
    id: 'Nummer-Vier',
    title: 'Bumpi & CityLink updates',
    date: '2025-08-11',
    excerpt: '4th.',
  },
  {
    id: 'five',
    title: 'updates to CityLink',
    date: '2025-08-13',
    excerpt: '5th.',
  },
  {
    id: 'six',
    title: 'CityLink Design Overhaul',
    date: '2025-08-14',
    excerpt: '6th.',
  },
    {
    id: 'seven',
    title: 'Backend redesign',
    date: '2025-10-10',
    excerpt: '7th.',
  },
    {
    id: 'eight',
    title: 'Geofencer update / game mode auth implemented',
    date: '2025-11-11',
    excerpt: '8th.',
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
