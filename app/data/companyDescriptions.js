// app/data/companyDescriptions.js
export const COMPANY_DESCRIPTIONS = {
  'aeromtu.jpg': `
    <strong>Project:</strong> Multi-Monitor Animation <br> 
    <strong>Gig:</strong> Salon International de l'Aéronautique et de l'Espace, Paris-Le Bourget <br>
    <strong>Role:</strong> From Concept to Final Render<br>
    <strong>Technologies:</strong> Three.js, React, WebGL<br>
    <a href="https://example.com" target="_blank" rel="noopener noreferrer">View Project</a>
  `,
  'bmw.jpg': `
    <strong>Project:</strong> Digital Showroom<br>
    <strong>Role:</strong> Motion Designer<br>
    <strong>Technologies:</strong> After Effects, Cinema 4D<br>
    <a href="https://example.com/bmw" target="_blank" rel="noopener noreferrer">Case Study</a>
  `,
  'automerc.jpg': 'seriously Under Construction',
  // Add all your companies and descriptions here
  // Format: 'filename.jpg': 'Description of work'
};
// Helper function to get description with fallback
export function getCompanyDescription(logoName) {
  return COMPANY_DESCRIPTIONS[logoName] || `Worked with ${logoName.split('.')[0]} on various design and development projects.`;
}