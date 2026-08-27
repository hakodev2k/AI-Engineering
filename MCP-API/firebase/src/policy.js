import crypto from "node:crypto";

export const TOOL_MAP = Object.freeze({
  "firebase.project.get": { upstream: "firebase_get_project", risk: "READ", approval: false },
  "firebase.project.list": { upstream: "firebase_list_projects", risk: "READ", approval: false },
  "firebase.app.list": { upstream: "firebase_list_apps", risk: "READ", approval: false },
  "firebase.app.sdk_config.get": { upstream: "firebase_get_sdk_config", risk: "READ", approval: false },
  "firebase.firestore.document.get": { upstream: "firestore_get_document", risk: "READ", approval: false },
  "firebase.firestore.document.list": { upstream: "firestore_list_documents", risk: "READ", approval: false },
  "firebase.firestore.collection.list": { upstream: "firestore_list_collections", risk: "READ", approval: false },
  "firebase.firestore.document.create": { upstream: "firestore_add_document", risk: "WRITE", approval: true },
  "firebase.firestore.document.update": { upstream: "firestore_update_document", risk: "WRITE", approval: true },
  "firebase.firestore.document.delete": { upstream: "firestore_delete_document", risk: "DESTRUCTIVE", approval: true },
  "firebase.remote_config.template.get": { upstream: "remoteconfig_get_template", risk: "READ", approval: false },
  "firebase.remote_config.template.update": { upstream: "remoteconfig_update_template", risk: "HIGH_RISK", approval: true },
  "firebase.storage.object.download_url.get": { upstream: "storage_get_object_download_url", risk: "READ", approval: false }
});

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
}

export function approvalDigest(secret, tool, payload) {
  return crypto.createHmac("sha256", secret)
    .update(`${tool}\n${stableStringify(payload)}`)
    .digest("hex");
}

export function authorize(config, tool, payload, approvalToken) {
  const policy = TOOL_MAP[tool];
  if (!policy) throw new Error(`Unknown tool: ${tool}`);
  if (policy.risk === "DESTRUCTIVE" && !config.destructiveEnabled) {
    throw new Error(`${tool} is disabled; set FIREBASE_ENABLE_DESTRUCTIVE=true to enable it`);
  }
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires FIREBASE_APPROVAL_SECRET`);
  if (!approvalToken) throw new Error(`${tool} requires explicit approval_token`);
  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(approvalToken, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error(`Invalid approval_token for ${tool}`);
  }
}

export function withoutApproval(args = {}) {
  const { approval_token: _ignored, ...payload } = args;
  return payload;
}
