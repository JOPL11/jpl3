import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import DOMPurify from 'isomorphic-dompurify';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to sanitize HTML
function sanitizeInput(input) {
  // Convert to string in case input is not a string
  const str = String(input || '');
  // Sanitize and return
  return DOMPurify.sanitize(str);
}

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Validate the input
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Sanitize all inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = sanitizeInput(message);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'jan.peiro@protonmail.com',
      reply_to: sanitizedEmail,
      subject: `New Contact Form Submission from ${sanitizedName}`,
      text: `
        You've received a new message from your portfolio contact form.
        
        Name: ${sanitizedName}
        Email: ${sanitizedEmail}
        
        Message:
        ${sanitizedMessage}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p>You've received a new message from your portfolio contact form.</p>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { message: 'Failed to send email', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Message sent successfully!', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
