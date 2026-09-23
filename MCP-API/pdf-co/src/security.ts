export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export class ApprovalError extends Error {
  constructor(message: string) { super(message); this.name = "ApprovalError"; }
}

export function requireApproval(risk: Risk, approved: boolean | undefined, env = process.env): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new ApprovalError("Destructive PDF.co tools are disabled by this connector.");
  const requireWrites = (env.PDFCO_REQUIRE_WRITE_APPROVAL ?? "true").toLowerCase() !== "false";
  if (risk === "HIGH_RISK" && approved !== true) throw new ApprovalError("Explicit human approval is required.");
  if (risk === "WRITE" && requireWrites && approved !== true) throw new ApprovalError("Human approval is required for document transformations.");
}

export function validateRemoteUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("Only HTTPS source URLs are allowed.");
  const h = url.hostname.toLowerCase();
  if (h === "localhost" || h === "127.0.0.1" || h === "::1" || h.endsWith(".local")) throw new Error("Local/private hosts are not allowed.");
  if (/^(10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h)) throw new Error("Private network addresses are not allowed.");
  return url.toString();
}

export function asUntrusted<T>(data: T): { untrustedProviderData: T } {
  return { untrustedProviderData: data };
}
