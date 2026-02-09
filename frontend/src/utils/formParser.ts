export function buildFormDataStrict<T extends Record<string, unknown>>(
  data: T,
): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value == null) continue;

    if (value instanceof File) {
      formData.append(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      console.error(`Cannot serialize array field: ${key}`);
      throw new Error(`Cannot serialize array field: ${key}`);
    }

    if (typeof value === "object") {
      console.error(`Cannot serialize object field: ${key}`);
      throw new Error(`Cannot serialize object field: ${key}`);
    }

    formData.append(key, String(value));
  }

  return formData;
}
