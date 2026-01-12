import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Information about how we handle your data and privacy.'
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p className="mb-4">
          We are committed to your privacy. The only information we collect and store is:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Information you voluntarily provide when contacting us through our contact form (your email address and message)</li>
        </ul>
        <p className="text-sm text-gray-600 mb-4">
          Note: Our hosting provider (Vercel) may collect server logs for operational purposes, but we do not access or store these logs.
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <strong>Privacy Policy:</strong> We do not use any analytics, tracking, or data collection technologies on this website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Respond to your inquiries and provide customer support</li>
          <li>Improve our website and services</li>
          <li>Ensure the security of our website</li>
        </ul>
      </section>

<section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
        <p className="mb-4">
          You have the right to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Request access to your personal information</li>
          <li>Request correction or deletion of your information</li>
          <li>Withdraw your consent for data processing</li>
        </ul>
        <p>
          To exercise these rights, please contact us through our contact form.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
        </p>
      </section>

      <div className="mt-8 pt-6 border-t">
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </main>
  );
}
