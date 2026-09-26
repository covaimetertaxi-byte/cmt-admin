/**
 * Normalizes user-pasted image URLs (e.g., Google Drive, Dropbox, direct web links)
 * into direct embeddable image stream URLs.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Google Drive sharing URL formats:
  // e.g., https://drive.google.com/file/d/1A2B3C4D5E/view?usp=sharing
  // e.g., https://drive.google.com/open?id=1A2B3C4D5E
  const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`;
  }

  const driveOpenMatch = trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveOpenMatch && driveOpenMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;
  }

  const driveUcMatch = trimmed.match(/drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/);
  if (driveUcMatch && driveUcMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveUcMatch[1]}`;
  }

  // Dropbox share links
  if (trimmed.includes('dropbox.com') && trimmed.includes('dl=0')) {
    return trimmed.replace('dl=0', 'raw=1');
  }

  return trimmed;
}
