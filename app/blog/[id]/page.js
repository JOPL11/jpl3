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
            <li>Geofencer works but now I have to figure out a way to make it work with the demo version, tricky because the one sort of invalidates the other. Need to find a way to maintain security while allowing demo access. Maybe it should be turned off for the demo. Kind of a drag because its a core feature that sort of needs to be explained to users in the demo context so they understand the security implications and why it&apos;s important for the overall security model - it&apos;s a key part of the app&apos;s security architecture.</li>
            <li>See, the final version is meant to work in a geofenced sandbox, the demo version needs to work from anywhere. Maybe if I let the demo user create his own geofence. But that might be asking too much of a user, Im on the fence about it. </li>
            <li>Working on a better way to handle user sessions and authentication for the demo version.</li>
          </ul>
      </>
    ),
  },
  'nine': {
    title: 'Relocation to Egypt',
    date: '2025-11-23',
    content: (
      <>
        <p>Relocation and the Death of The German Dream</p>
          <ul>
            <li>Der Untergang der Nachkriegszeit </li>


<p>It had been a lovely day in Munich, Bavaria. The sky was full of bulging white cumulus clouds, the air was crisp, and I was seated in a spacious meeting-room at a large round table, across from a small man with a face that had the features of both Heinrich Himmler and Alvin the chipmunk.</p>

<p>To his left, a tall voluptuous blond was seated, shuffling a printout of my CV. She was drop dead gorgeous, a pen stuck in her tousled hair, large glasses, the spitting image of a hot secretary.</p>

<p>To his right, a small lady with a gnarled face like a turnip sat poised like a cat. Her eyes gleamed in the sun that streamed in through the windows.</p>

<p>The man began the meeting cordially, introducing himself as the company owner and CEO, giving me the usual introductory line of PR scented bullshit about their company. Global player blah blah, vast client portfolio blah blah, what have you.</p>

<p>At some point the lady to the man's right introduced herself, speaking in the typical barnyard bavarian tounge, as the company psychologist. It was the local dialect that shall we say did not reek of sophistication to begin with. It was linguistically stuck somewhere between German and Austrian the way a cat is stuck in the engineblock of a BMW for 100 miles on the Autobahn before a Bavarian identifies the noise and pulls over to rescue his engine.</p>

<p>The psychologist lady quickly got down to brass tacks: "Mister P," she smiled through clenched teeth framed by her petite tusks, "We see that you are from abroad - a Spanish citizen."</p>
<p>I nodded amicably, it was true I was Spanish on paper, I had two passports and had spent 3 years in Barcelona - she continued with a piercing stare, "We see that those whom we here in Bavaria call foreign Southerners occasionally like to raise their voice at women, and in the course of sometimes doing so, whether your hand should somehow slip and you find yourself slapping them in the face. What I'm asking is, Mr. P, being Spanish, do you beat women?"</p>

<p>Well that was a shock.</p>

<p>I wasn't prepared for that level of intercultural exchange.</p>

<p>The first thing I wanted to ask matter-of-factly was how many Jews she'd gassed before breakfast, but my mind shoved that one out of the way. Then the image of me comedically lunging across the table at her popped into my head, dismissed that too. Where’d she get her degree, University of Auschwitz? My mind raced and I looked over to the CEO and his SS She-wolf, who were grinning hungrily at me as though I was lunch and that was a perfectly legitimate question.</p>

<p>The CV sitting on the desk before them clearly showed I had lived in Spain for three years, that much was true. The rest of the time spent in Montreal, Toronto and Philly just sort of didn’t seem to catch their eye. Likewise, they seemed to have been unaware I’d previously been on the team that had handed them Lufthansa as a client.</p>

<p>Then images of my German mother disowning my brother because he had planned his wedding for the same day she had planned to redecorate her kitchen, popped into my head. Then I remembered how she disowned me for following the rules she had created - rules which stated that not following them would result in my disownment. Then the suicide threats of my previous two Munich girlfriends popped into my head, both suffering from / wielding a thing called BPD, which deserves its own novel but not right here. Then the images of Spielberg Germans screaming at Auschwitz Jews washed over me. Their mastery at flattening people into a single loaded term and their complete outrage at having it done to themselves. The long history of warfare and murder and relentless infighting that made up the bulk of German history - from the Holy Roman Empire when they were a wildly splintered collection of feudal states murdering eachother in the name of order, to their infamous installment of the industrial genocide state murdering others in the name of order, to their current enactment of prejudice without an iota of self-awareness congealing into its newer form in the name of order, and all these visions of ‘order’ ultimately serving no other purpose than to obfuscate their personal sadistic arbitrariness, washed over me.</p>

<p>"This . . . interview . . . is over." I muttered.</p>

<p>On my way out the door I noted the workers there were made up of a disproportionally large number of blond and blue-eyed people. Jesus, I thought, what kind of Aryan brotherhood had I wandered into here?</p>

<p>Bavaria was so backwards that even its psychologists were full of xenophobia and misandry. What hope was there for that place? That was the moment that finally rammed it home for me - Munich was a lost cause.</p>


           
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
