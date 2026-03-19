export function getInputClass(value: string) {
  if (!value || value.trim() === "") {
    return "border-red-400 focus:ring-1 focus:ring-red-400";
  }
  return "border-green-400 focus:ring-1 focus:ring-green-400";
}