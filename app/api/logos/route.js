import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const logosDirectory = path.join(process.cwd(), 'public', 'images', 'mini');
    const files = await fs.readdir(logosDirectory);
    // Filter for jpg/jpeg files
    const logoFiles = files.filter(file => 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg')
    );
    return Response.json(logoFiles);
  } catch (error) {
    console.error('Error reading logos directory:', error);
    return Response.json({ error: 'Failed to load logos' }, { status: 500 });
  }
}