export function ensureNonFalsy<T>(value: T | null | undefined, errorMsg: string): T {
	if (!value && typeof value !== 'number') throw new Error(`Error: ${errorMsg}`);
	return value;
}
