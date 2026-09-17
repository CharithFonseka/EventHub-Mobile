// src/utils/validation.ts
// Shared form validation helpers

export const validateEmail = (email: string): string | undefined => {
  if (!email) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Enter a valid email address';
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
};

export const validateDisplayName = (name: string): string | undefined => {
  if (!name || !name.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
};

export const validatePhone = (phone: string): string | undefined => {
  if (!phone) return undefined; // optional
  const re = /^\+?[\d\s\-()]{7,15}$/;
  if (!re.test(phone)) return 'Enter a valid phone number';
};

export const formatFirebaseError = (code: string): string => {
  const map: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Please log in.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password is too weak.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/user-disabled': 'This account has been disabled.',
  };
  return map[code] ?? 'An unexpected error occurred. Please try again.';
};
