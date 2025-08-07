import { TIME_ZONE } from 'src/config/config';

export function dateToLocaleString(date: Date): string {
  return date.toLocaleDateString('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
