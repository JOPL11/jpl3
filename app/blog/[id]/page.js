import { notFound } from 'next/navigation';
import BlogPostContent from './BlogPostContent';

// This would typically come from a CMS or markdown files
const posts = {
  'first-post': {
    title: 'My First Blog Post',
    date: '2025-07-20',
    content: (
      <>
        <p>Added a login section with registration, login capability, and made the app work with that or without it. Fixed some database stuff in the backend. </p>

        <p>(Had to disable all language versions other than German for the time, the complexity the other languages introduce in the program aren&apos;t worth dealing with until the basic architecture is completed.)</p>

      </>
    ),
  },
  'second-post': {
    title: 'Another Blog Post',
    date: '2025-08-05',
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
  'third-post': {
    title: 'App Name Change',
    date: '2025-08-09',
    content: (
      <>
        <p>This app has had a few names during development. Starting with Glassfinder, then came Scherbenmelder, then the concept evolved and it became Stadtberichter. 
          </p>
        <p>They all sound silly or overly serious. So I&apos;m going with Bumpi. </p>
        <p>It&apos;s on the fine line between cute and harmless and maybe a bit fun. </p>
        <p>Way better than Stadtmelder  or StadtBerichter . . . which come off as way too severe and vaguely evoking surveillance so it had to go.</p>
        <p>New logo is created and implemented.</p>
        <p>I toyed around with Glip, Blipsy, Dingit, Wombi. Naah - it&apos;s gotta be Bumpi.</p>
        <p>Same goes for the dashboard. But this would have to be a little more serious than Bumpi. No city official is going to take themselves seriously working with an app called Bumpi. That&apos;s why we&apos;ll called the backend dashboard - CityLink.</p>
        <p>CityLink is a bit more serious and professional.</p>
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
