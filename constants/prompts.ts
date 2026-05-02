export const DAILY_PROMPTS = [
  "What were your highlights from today?",
  "What made you smile today?",
  "What are you most grateful for today?",
  "What was the best moment of your day?",
  "What did you learn or discover today?",
  "What made today meaningful?",
  "Who made a positive impact on your day?",
  "What are you proud of from today?",
  "What would you want to remember about today?",
  "What brought you joy today?",
  "What surprised you today?",
  "What small moment stood out today?",
  "What are you looking forward to after today?",
  "What did you do for someone else today?",
  "What made today unique?",
];

export const getDailyPrompt = (): string => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatShortDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};
