const InvalidDateError = new TypeError('Could not convert value to Date');

export function coerceToDate(value: string | number | Date): Date {
  const dateValue = new Date(value);

  if (dateValue.toJSON() === null) throw InvalidDateError;

  return dateValue;
}

export function serialize(value: string | number | Date): string {
  const dateValue = new Date(value).toJSON();

  if (dateValue === null) throw InvalidDateError;

  return dateValue;
}
