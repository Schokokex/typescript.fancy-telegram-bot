/** @format */

export default function toWords(s: string): string[] {
	return s.trim().split(/\W+/);
}
