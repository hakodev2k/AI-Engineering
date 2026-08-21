# Hooks

## Hook 1 — Post-Discovery Schema Preflight

**Trigger:** immediately after MCP/framework tool discovery and before tools are exposed to the model.

**Action:** serialize discovered tool schemas, select the active provider profile, run deterministic preflight, cache verdicts by fingerprint/profile version, quarantine or block incompatible tools.

**Command:**
`python scripts/schema_preflight.py --input tool-manifest.json --profiles config/provider-profiles.json --profile openai-strict --report preflight-report.json`

**Expected result:** exit 0 and every enabled tool marked compatible, or exit 2 with explicit rule/path findings and no provider request attempted.

**Failure behavior:** unknown profile, unreadable manifest, or validator failure blocks tool-enabled inference. Do not bypass the hook.

---

## Hook 2 — Provider/Model Change Invalidation

**Trigger:** provider, model family, compatibility profile, SDK converter, or MCP server version changes.

**Action:** invalidate cached compatibility verdicts whose key includes the changed dimension and rerun Hook 1.

**Expected result:** no verdict from a different provider/profile version is reused.

**Failure behavior:** disable tool exposure until fresh preflight completes.

---

## Hook 3 — Pre-Dispatch Argument Gate

**Trigger:** generic/deferred tool call is about to be dispatched without concrete provider-native schema validation.

**Action:** run runtime argument validation using the current validated schema and candidate arguments.

**Command:**
`python scripts/schema_preflight.py --input single-tool-schema.json --profiles config/provider-profiles.json --profile mcp-baseline --args candidate-args.json`

**Expected result:** exit 0 before dispatch.

**Failure behavior:** exit 2 prevents dispatch and returns only structured rule/path evidence. Permit at most one corrected argument attempt.

---

## Hook 4 — Provider Schema Error Capture

**Trigger:** downstream provider returns invalid tool/function/schema error after local preflight passed.

**Action:** capture provider/model/profile version, schema fingerprint, tool name, sanitized error code/path, and create a regression input. Do not record argument values or secrets.

**Expected result:** deterministic evidence package for Workflow C.

**Failure behavior:** quarantine affected fingerprint for the current provider profile and prevent unchanged retries.

---

## Hook 5 — Final Verification

**Trigger:** before marking a compatibility change complete.

**Action:** execute regression tests, verify 100% preflight coverage, verify no unchanged invalid fingerprint was submitted, and compare provider schema error rate with baseline.

**Command:**
`python tests/test_schema_preflight.py`

**Expected result:** zero failed assertions plus objective metrics.

**Failure behavior:** status remains Implemented or Measured, never Verified.
