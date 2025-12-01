import { notFound } from 'next/navigation';
import BlogPostContent from './BlogPostContent';

// This would typically come from a CMS or markdown files
const posts = {
  'first-post': {
    title: 'My First Blog Post',
    date: '2025-07-20',
    content: (
      <>
        <p>Added a login section with registration, auth, and made the app work with that or without it. Fixed some database stuff in the backend. </p>

        <p>(Had to disable all language versions other than German for the time, the complexity the other languages introduce in the program aren&apos;t worth dealing with until the basic architecture is completed.)</p>

      </>
    ),
  },
  'second-post': {
    title: 'Another Blog Post',
    date: '2025-08-05',
    content: (
      <>
        <p>Here are updates to the main stadtberichter app</p>

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
          <li>Just took another look at the i18n translations. Sometimes they seem to not work on the live server. Huh. Back to the drawing board.</li>
        </ul>
        <p>Municipal Dashboard for the City Workers</p>
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
    date: '2025-08-11',
    content: (
      <>
        <p>This app has had a few names during development. Starting with Glassfinder, then came Scherbenmelder, then the concept evolved and it became Stadtberichter. </p>
        <p>They all sound off the mark or too serious. We need something fun and harmless for civilian citizens to identify with.</p>
        <p>So I&apos;m going with Bumpi. </p>
        <p>It&apos;s on the fine line between cute and harmless and maybe a bit fun. </p>
        <p>Way better than Stadtmelder or StadtBerichter . . . which come off as too severe so it had to go. Especially since I am anonymizing the heck out of personal data.</p>
        <p>New logo is created and implemented.</p>
        <p>I toyed around with Glip, Blipsy, Dingit, Wombi. Naah - it&apos;s gotta be Bumpi.</p>
        <p>Same goes for the dashboard. But this would have to be a little more serious than Bumpi. No city official is going to take themselves seriously working with a dashboard app called Bumpi.</p> 
        <p>That&apos;s why we shall henceforth call the backend dashboard - CityLink.</p>
        <p>CityLink is a bit more serious and professional than Bumpi</p>
        <br /> 
        <p>Heres updates to CityLink app</p>
          <ul>
            <li>Added Filter-by-Month dropdown</li>
            <li>Added Report Detail Overlay for more explicit information about reports</li>
            <li>Thats also a place where more actions can be taken, like adding scores for gamemode maybe.</li>
          </ul>
          <p>Heres updates to Bumpi</p>
          <ul>
            <li>Added French lang support</li>
            <li>Encrypted Geofence coords in the geofence creation tool</li>
            <li>Decrypted Geofence coords in all the other places</li>
            <li>Fixed duplicate i18n triggers</li>
            <li>Started on a honeypot dead-end for attackers that made it look like they were being referred to Langley VA.</li>
            <li>Fixed i18 routing issues</li>
            <li>Fixed some RLS issues</li>
          </ul>
      </>
    ),
  },
  'Nummer-Vier': {
    title: 'Updates to both apps',
    date: '2025-08-11',
    content: (
      <>
        <p>Heres updates to CityLink app</p>
          <ul>
            <li>Added Filter-by-Month dropdown</li>
            <li>Added Report Detail Overlay for more explicit information about reports</li>
            <li>Thats also a place where more actions can be taken, like adding scores for gamemode maybe.</li>
          </ul>
          <p>Heres updates to Bumpi</p>
          <ul>
            <li>Added French lang support</li>
            <li>Encrypted Geofence coords in the geofence creation tool</li>
            <li>Decrypted Geofence coords in all the other places</li>
            <li>Fixed duplicate i18n triggers</li>
            <li>Started on a honeypot dead-end for attackers that made it look like they were being referred to Langley VA.</li>
            <li>Fixed i18 routing issues</li>
            <li>Fixed some RLS issues</li>
          </ul>
      </>
    ),
  },
  'five': {
    title: 'Mapper upgrade',
    date: '2025-08-13',
    content: (
      <>
        <p>Heres updates to CityLink app</p>
          <ul>
            <li>UI Fixes / Mobile Menu zIndex issue</li>
            <li>Report Overlay: Restyle, Textfixes, added Notes input field and SQL&apos;d it, gave it a scroller</li>
            <li>Geofencer modal restyled</li>
            <li>Added MaterialUI thing bottom right. No real point to it other than psychological / visual. Makes the app look more like a cohesive tool. I mean it&apos;s something. Maybe I&apos;ll give it a function later.</li>
          </ul>
      </>
    ),
  },
  'six': {
    title: 'CityLink Design Overhaul',
    date: '2025-08-14',
    content: (
      <>
        <p>Heres updates to CityLink app</p>
          <ul>
            <li>Complete overhaul of the design</li>
            <li>Away from the winXP look (dunno why that happened, maybe I couldnt think of anything better while I was working on the functionality) / towards a more modern look</li>
            <li>Geofencer included</li>
          </ul>
      </>
    ),
  },
  'seven': {
    title: 'CityLink Backend',
    date: '2025-10-10',
    content: (
      <>
        <p>Heres updates to CityLink app</p>
          <ul>
            <li>Added sorting by month</li>
            <li>Better data organization</li>
            <li>Geofencer now uses hashed identifiers for privacy</li>
            <li>Improved data security practices</li>
          </ul>
      </>
    ),
  },
  'eight': {
    title: 'Geofencer update & Game mode auth implemented',
    date: '2025-11-11',
    content: (
      <>
        <p>Heres updates to CityLink app</p>
          <ul>
            <li>Hashed Login implemented with secure token handling.</li>
            <li>Geofencer works but now I have to figure out a way to make it work with the demo version, tricky because the one sort of invalidates the other. Need to find a way to maintain security while allowing demo access. Maybe it should be turned off for the demo. Kind of a drag.</li>
            <li>Working on a better way to handle user sessions and authentication for the demo version.</li>
          </ul>
      </>
    ),
  },
};

// This is a workaround component to handle the async params
function BlogPostWrapper({ params }) {
  const post = posts[params.id];
  if (!post) notFound();
  return <BlogPostContent post={post} />;
}

export default function BlogPost({ params }) {
  // This should suppress the warning
  const safeParams = { ...params };
  return <BlogPostWrapper params={safeParams} />;
}

// This tells Next.js which routes to pre-render at build time
export async function generateStaticParams() {
  return Object.keys(posts).map((id) => ({
    id,
  }));
}

// This ensures that only the pre-rendered paths are allowed
export const dynamicParams = false;
