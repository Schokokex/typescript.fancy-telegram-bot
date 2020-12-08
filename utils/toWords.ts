export default function toWords(s: string) {
    return s.trim().split(/\W+/);
}