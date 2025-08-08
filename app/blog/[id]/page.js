import { notFound } from 'next/navigation';
import BlogPostContent from './BlogPostContent';

// This would typically come from a CMS or markdown files
const posts = {
  'first-post': {
    title: 'My First Blog Post',
    date: '2025-08-04',
    content: (
      <>
        <p>Added a login section with registration, login capability, and made the app work with that or without it. Fixed some database stuff in the backend. </p>

        <p>(Had to disable all language versions other than German for the time, the complexity the other languages introduce in the program aren&apos;t worth dealing with until the basic architecture is completed.)</p>

      </>
    ),
  },
  'second-post': {
    title: 'Another Blog Post',
    date: '2025-08-08',
    content: (
      <>
        <p>Heres updates to the main stadtberichter app</p>

        <ul>
          <li>Added geofencing (restricting reports to a specific geographic area)</li>
          <li>Added geofence creation tool (demo so users can build a geofence around their location to test if it works) (it does)</li>
          <li>added how it works card</li>
          <li>Bullet points</li>
          <li>Updated Location chooser map style</li>
          <li>reimplemented and improved language switcher (though not perfect yet)</li>
          <li>created Login for gamemode</li>
          <li>Added CSRF and XSS to make it harder to hack</li>
          <li>created clientside score fetching</li>
          <li>Just took another look at the i18n translations. Sometimes they seem to not work on the live server. Huh. Back to the drawin board.</li>
        </ul>
        <p>Municipal Dashboard for the City Worker https://sb-map.vercel.app/ </p>
        <ul>
        <li>improved dashboard styling</li>
        <li>added geofencing tool</li>
        <li>(the city worker in charge of coordinating the cleaning crews flips the report from Neu to Erledigt and this should trigger a score incrementation for the report submitter. .. this is really hard to get right now.)</li>
        <li>currently adding score distribution. </li>
        </ul>
   
      </>
    ),
  },
};

export default function BlogPost({ params }) {
  const post = posts[params.id];

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}

export async function generateStaticParams() {
  return Object.keys(posts).map((id) => ({
    id,
  }));
}

export const dynamicParams = false; // Return 404 for unknown posts
