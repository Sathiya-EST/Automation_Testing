import DOMPurify from 'dompurify';

// Type for the sanitizeInput function
export const sanitizeInput = (dirtyInput: unknown): string => {
  // If input is undefined or null, return empty string
  if (dirtyInput == null) {
    return '';
  }

  // If input is not a string, convert to string
  const inputString = String(dirtyInput);

  // Sanitize the input using DOMPurify
  // Type assertion to let TypeScript know that inputString is a string
  const cleanInput = DOMPurify.sanitize(inputString as string, {
    // Configuration options for sanitization
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href', 'target'],

    // Prevent potential XSS attacks by stripping dangerous content
    FORBID_TAGS: ['script', 'style'],
    FORBID_ATTR: ['onerror', 'onclick'],

    // Prevent HTML entities that could be used maliciously
    ALLOW_DATA_ATTR: false
  });

  return cleanInput;
}

// Example usage in different contexts
const unsafeUserInput = '<script>alert("XSS");</script>Hello <b>World</b>!';
const safeOutput = sanitizeInput(unsafeUserInput);
console.log(safeOutput); // Outputs: "Hello <b>World</b>!"

// React component example
interface UserContentProps {
  text: string;
}

export const UserContent: React.FC<UserContentProps> = ({ text }) => {
  const sanitizedText = sanitizeInput(text);

  return (
    <div
      // Use dangerouslySetInnerHTML with sanitized content
      dangerouslySetInnerHTML={{ __html: sanitizedText }}
    />
  );
}

// Additional helper for more strict sanitization
export const strictSanitizeInput = (dirtyInput: unknown): string => {
  // Even more aggressive sanitization
  const cleanInput = DOMPurify.sanitize(dirtyInput as string, {
    ALLOWED_TAGS: [], // Completely strip all HTML tags
    ALLOWED_ATTR: []  // Remove all attributes
  });

  return cleanInput;
}
