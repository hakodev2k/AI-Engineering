# Hooks

## Hook — Pre-Registration Identity Check
**Trigger:** Before a discovered MCP tool is inserted into the model-visible registry.

**Action:** Derive canonical ID from host instance ID, origin fingerprint, connection generation, exact tool name, and schema digest; reject missing or conflicting identity fields.

**Command/script:**
`python scripts/tool_identity_guard.py derive --record candidate.json`

**Expected result:** Exit 0 with deterministic identity JSON.

**Failure behavior:** Do not expose the tool; log metadata-only failure and quarantine the candidate entry.

---

## Hook — Catalog Collision Gate
**Trigger:** Startup, reconnect, or any accepted `tools/list` refresh.

**Action:** Scan complete candidate catalog for duplicate canonical IDs, ambiguous aliases, stale generations, and schema/origin drift.

**Command/script:**
`python scripts/audit_tool_catalog.py catalog.json`

**Expected result:** Exit 0 and `blocking_findings: 0`.

**Failure behavior:** Keep previous known-good registry snapshot when safe; otherwise disable affected server instance. Never select the first collision automatically.

---

## Hook — Approval Binding
**Trigger:** Before presenting or storing an approval decision.

**Action:** Resolve alias to one canonical ID and store ID, origin fingerprint, schema digest, generation, and optional arguments digest with the approval.

**Command/script:** Host adapter plus `tool_identity_guard.py derive` for identity validation.

**Expected result:** Approval contains all configured binding fields.

**Failure behavior:** Refuse to create a reusable approval; require operator review.

---

## Hook — Pre-Dispatch Revalidation
**Trigger:** Immediately before the concrete MCP connection receives `tools/call`.

**Action:** Compare the approval/policy identity against the current live registry and connection generation.

**Command/script:**
`python scripts/tool_identity_guard.py verify-invocation --approval approval.json --live live-record.json`

**Expected result:** Exit 0 and `status: allowed`.

**Failure behavior:** Deny before execution, invalidate stale approval, emit an identity-mismatch audit event. Do not automatically retry on another server.

---

## Hook — Post-Dispatch Audit Correlation
**Trigger:** After dispatch acceptance/result or transport failure.

**Action:** Persist request ID, canonical ID, origin fingerprint, generation, exact tool name, display alias, and actual dispatcher connection ID.

**Command/script:** Host audit sink.

**Expected result:** Approval and dispatch events can be joined by request ID and canonical ID.

**Failure behavior:** For sensitive tools, treat inability to produce audit correlation as a release/runtime policy failure; for lower-risk tools, alert according to local policy.

---

## Hook — Release Security Gate
**Trigger:** Before deploying registry, approval, dispatcher, MCP adapter, or naming changes.

**Action:** Run unit tests and catalog fixtures, then require independent verification of policy-to-dispatch identity continuity.

**Command/script:**
`python -m unittest discover -s tests -v`

**Expected result:** All tests pass without bypass flags.

**Failure behavior:** Block release. Maximum one fix/retest cycle per defect in an automated pipeline; further failures require human investigation.