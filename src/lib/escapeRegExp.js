export default function escapeRegExp(string){
  // escapes special characters for regex consumption
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}