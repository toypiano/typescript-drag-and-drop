export interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validate(...validatables: Validatable[]): boolean {
  return validatables.every((v) => validateOne(v));
}

function validateOne(v: Validatable): boolean {
  if (v.required && v.value.toString().length === 0) return false;
  if (
    v.minLength != null &&
    typeof v.value === 'string' &&
    v.value.length < v.minLength
  )
    return false;
  if (
    v.maxLength != null &&
    typeof v.value === 'string' &&
    v.value.length > v.maxLength
  )
    return false;
  if (v.min != null && typeof v.value === 'number' && v.value < v.min)
    return false;
  if (v.max != null && typeof v.value === 'number' && v.value > v.max)
    return false;
  return true;
}
