export function getInputClass(value: string): string {
  const defaultHeader = "Rank # | Schedule | Campaign_name | Created_date";
  const trimmed = value.trim();

  if (!trimmed) {
    // Empty or only whitespace → clearly needs input
    return "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-400";
  }

  if (trimmed === defaultHeader) {
    // User hasn't changed the example header yet
    return "border-yellow-400 bg-yellow-50/50 focus:border-yellow-500 focus:ring-yellow-400";
  }

  // User has entered/changed something → assume it's valid for now
  return "border-green-400 bg-green-50/50 focus:border-green-500 focus:ring-green-400";
}