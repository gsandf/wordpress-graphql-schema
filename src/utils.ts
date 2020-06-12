import sift from 'sift';

export function isPlainObject(obj: unknown): boolean {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj) &&
    obj === Object(obj)
  );
}

export function filterArray<T>(array: T[], filters = {}): T[] {
  return array.filter(sift(siftifyArguments(filters)));
}

export function siftifyArguments(args: Record<string, any>, level = 0): any {
  const newArgs: Record<string, any> = {};

  Object.entries(args).forEach(([key, value]) => {
    if (isPlainObject(value)) {
      newArgs[key] = siftifyArguments(value, level + 1);
    }

    if (level > 0) {
      newArgs[`$${key}`] = value;
    }
  });

  return newArgs;
}
