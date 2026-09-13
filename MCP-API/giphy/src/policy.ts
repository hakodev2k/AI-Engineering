export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function authorize(risk: Risk): void {
  if (risk !== "READ") throw new Error(`Permission denied: ${risk} operations are not enabled by the GIPHY connector`);
}
