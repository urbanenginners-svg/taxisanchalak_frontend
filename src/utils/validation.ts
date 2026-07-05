export type FieldValidator<T extends Record<string, unknown>> = (
  value: T[keyof T],
  values: T,
) => string | undefined;

export const validators = {
  required:
    <T extends Record<string, unknown>>(message = 'This field is required'): FieldValidator<T> =>
    (value) => {
      if (value === undefined || value === null) return message;
      if (typeof value === 'string' && !value.trim()) return message;
      return undefined;
    },

  email:
    <T extends Record<string, unknown>>(message = 'Enter a valid email address'): FieldValidator<T> =>
    (value) => {
      if (typeof value !== 'string' || !value.trim()) return undefined;
      return /^\S+@\S+\.\S+$/.test(value.trim()) ? undefined : message;
    },

  phone:
    <T extends Record<string, unknown>>(message = 'Enter a valid 10-digit phone number'): FieldValidator<T> =>
    (value) => {
      if (typeof value !== 'string' || !value.trim()) return undefined;
      const digits = value.replace(/\D/g, '');
      return digits.length >= 10 ? undefined : message;
    },

  minLength:
    <T extends Record<string, unknown>>(min: number, message?: string): FieldValidator<T> =>
    (value) => {
      if (typeof value !== 'string') return undefined;
      if (!value.trim()) return undefined;
      return value.trim().length >= min ? undefined : message ?? `Must be at least ${min} characters`;
    },

  positiveNumber:
    <T extends Record<string, unknown>>(message = 'Enter a valid amount'): FieldValidator<T> =>
    (value) => {
      if (typeof value !== 'string' || !value.trim()) return undefined;
      const n = Number(value);
      return !Number.isNaN(n) && n > 0 ? undefined : message;
    },

  nonNegativeNumber:
    <T extends Record<string, unknown>>(message = 'Enter a valid amount'): FieldValidator<T> =>
    (value) => {
      if (typeof value !== 'string' || !value.trim()) return undefined;
      const n = Number(value);
      return !Number.isNaN(n) && n >= 0 ? undefined : message;
    },

  yearRange:
    <T extends Record<string, unknown>>(min: number, max: number): FieldValidator<T> =>
    (value) => {
      if (typeof value !== 'string' || !value.trim()) return undefined;
      const year = Number(value);
      if (Number.isNaN(year) || year < min || year > max) {
        return `Enter a year between ${min}–${max}`;
      }
      return undefined;
    },
};

export function runFieldValidators<T extends Record<string, unknown>>(
  field: keyof T,
  values: T,
  rules: Partial<Record<keyof T, FieldValidator<T>[]>>,
): string | undefined {
  const fieldRules = rules[field];
  if (!fieldRules) return undefined;
  for (const rule of fieldRules) {
    const error = rule(values[field], values);
    if (error) return error;
  }
  return undefined;
}

export function validateAllFields<T extends Record<string, unknown>>(
  values: T,
  rules: Partial<Record<keyof T, FieldValidator<T>[]>>,
): Partial<Record<keyof T, string>> {
  const next: Partial<Record<keyof T, string>> = {};
  for (const field of Object.keys(rules) as (keyof T)[]) {
    const error = runFieldValidators(field, values, rules);
    if (error) next[field] = error;
  }
  return next;
}
