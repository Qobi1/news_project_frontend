export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function formatDateSafe(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if date is invalid
    }
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    return dateString; // Return original string if parsing fails
  }
}

export function getShortDescription(text: string, wordCount: number = 20): string {
  if (!text) return '';
  
  // Strip HTML tags for consistent word counting
  const plainText = text.replace(/<[^>]*>/g, '');
  const words = plainText.split(' ');
  return words.length > wordCount ? words.slice(0, wordCount).join(' ') + '...' : plainText;
}

// Helper function to wrap consecutive images in a scrollable div
export function wrapImagesScrollable(html: string): string {
  // Match consecutive <img ... /> tags at the end of the content
  const imgGroupRegex = /((<img[^>]+>\s*){2,})$/;
  return html.replace(imgGroupRegex, (match) => {
    return `<div style="display: flex; overflow-x: auto; gap: 16px; padding: 12px 0; border-radius: 12px; background: #f8f9fa;">${match}</div>`;
  });
}

// Icon configuration
export const ICONS = {
  BRAND: 'bi bi-newspaper',
  CALENDAR: 'bi bi-calendar3',
  PERSON: 'bi bi-person',
  CLOCK: 'bi bi-clock',
  BACK: 'bi bi-arrow-left',
  FORWARD: 'bi bi-arrow-right',
  DOWN: 'bi bi-arrow-down',
  SEARCH: 'bi bi-search',
  NEWS: 'bi bi-newspaper'
};

export function getIconClass(iconType: keyof typeof ICONS, size: 'XS' | 'SM' | 'MD' | 'LG' | 'DISPLAY' = 'SM', variant?: 'MUTED'): string {
  const baseClass = ICONS[iconType] || 'bi bi-question-circle';
  const sizeClass = size === 'XS' ? 'fs-6' : 
                   size === 'SM' ? 'fs-5' : 
                   size === 'MD' ? 'fs-4' : 
                   size === 'LG' ? 'fs-3' : 
                   size === 'DISPLAY' ? 'fs-1' : 'fs-5';
  const variantClass = variant === 'MUTED' ? 'text-muted' : '';
  
  return `${baseClass} ${sizeClass} ${variantClass}`.trim();
}
