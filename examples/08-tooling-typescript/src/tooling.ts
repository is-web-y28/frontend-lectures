import meetupImageUrl from './assets/meetup.svg';

export const appTitle = import.meta.env.VITE_APP_TITLE;
export const importedMeetupImageUrl = meetupImageUrl;
export const publicBuildInfoUrl = `${import.meta.env.BASE_URL}build-info.txt`;

export function handlePreviewClick(executionCount: number): number {
  return executionCount + 1;
}
