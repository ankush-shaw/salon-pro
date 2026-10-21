// Helper to generate dynamic dates relative to current date in YYYY-MM-DD
export const getRelativeDate = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};
