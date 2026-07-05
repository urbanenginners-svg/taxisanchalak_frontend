import { useCallback, useRef, useState } from 'react';
import { runFieldValidators, validateAllFields, type FieldValidator } from '../utils/validation';

export function useFormValidation<T extends Record<string, unknown>>(
  initialValues: T,
  rules: Partial<Record<keyof T, FieldValidator<T>[]>>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const valuesRef = useRef(values);
  valuesRef.current = values;
  const submitRef = useRef(submitAttempted);
  submitRef.current = submitAttempted;

  const setValue = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      const next = { ...valuesRef.current, [field]: value } as T;
      setValues(next);
      valuesRef.current = next;

      setTouched((t) => {
        if (t[field as string] || submitRef.current) {
          const err = runFieldValidators(field, next, rules);
          setErrors((e) => ({ ...e, [field]: err }));
        } else {
          setErrors((e) => ({ ...e, [field]: undefined }));
        }
        return t;
      });
    },
    [rules],
  );

  const blur = useCallback(
    (field: keyof T) => {
      setTouched((t) => ({ ...t, [field]: true }));
      const err = runFieldValidators(field, valuesRef.current, rules);
      setErrors((e) => ({ ...e, [field]: err }));
    },
    [rules],
  );

  const validateAll = useCallback((): boolean => {
    setSubmitAttempted(true);
    const allTouched = Object.keys(rules).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Partial<Record<keyof T, boolean>>,
    );
    setTouched(allTouched);
    const nextErrors = validateAllFields(valuesRef.current, rules);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [rules]);

  const fieldError = useCallback(
    (field: keyof T): string | undefined => {
      if (!touched[field] && !submitAttempted) return undefined;
      return errors[field];
    },
    [touched, submitAttempted, errors],
  );

  const setFieldError = useCallback((field: keyof T, message?: string) => {
    setErrors((e) => ({ ...e, [field]: message }));
    setTouched((t) => ({ ...t, [field]: true }));
  }, []);

  return {
    values,
    setValue,
    blur,
    validateAll,
    fieldError,
    setFieldError,
    errors,
    touched,
    submitAttempted,
  };
}
