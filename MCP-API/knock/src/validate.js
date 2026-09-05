export function strictObject(value, allowed, required = []) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Arguments must be an object");
  for (const k of Object.keys(value)) if (!allowed.includes(k)) throw new Error(`Unknown argument: ${k}`);
  for (const k of required) if (value[k] === undefined || value[k] === null || value[k] === "") throw new Error(`Missing required argument: ${k}`);
  return value;
}
export function id(value, name) {
  if (typeof value !== "string" || value.length < 1 || value.length > 255 || /[/?#]/.test(value)) throw new Error(`${name} must be a 1-255 character identifier without / ? #`);
  return value;
}
export function optionalString(value, name, max = 500) {
  if (value === undefined) return;
  if (typeof value !== "string" || value.length > max) throw new Error(`${name} must be a string up to ${max} characters`);
}
export function pageSize(value) {
  if (value === undefined) return;
  if (!Number.isInteger(value) || value < 1 || value > 100) throw new Error("page_size must be an integer from 1 to 100");
}
export function approval(value) {
  if (value === undefined) return;
  strictObject(value, ["confirmed", "reason"], ["confirmed", "reason"]);
  if (value.confirmed !== true || typeof value.reason !== "string" || value.reason.length < 3 || value.reason.length > 500) throw new Error("Invalid approval object");
}
export function plainObject(value, name) {
  if (value === undefined) return;
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${name} must be an object`);
}
