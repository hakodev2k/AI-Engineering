# Workflows

## Workflow 1 — Catalog Admission

**Trigger:** Startup, MCP server enablement, reconnect, or tool-list change.

**Goal:** Admit only unambiguous tool identities into the model-visible registry.

**Inputs:** Trusted server configuration, live connection generation, `tools/list` result, identity policy.

**Baseline:** Count current entries, aliases, duplicate display names, unresolved identities, and existing approvals.

**Context:** Server-provided names/descriptions are metadata, not principals.

**Stages:**
1. Registry Identity Analyst exports the candidate catalog.
2. Compute origin fingerprint and schema digest for every tool.
3. Derive canonical IDs.
4. Run `audit_tool_catalog.py`.
5. Reject duplicate canonical IDs with inconsistent metadata and aliases mapping to multiple live IDs.
6. Invalidate approvals for replaced identities.
7. Atomically swap the validated registry snapshot.
8. Emit admission metrics.

**Responsible agent:** Registry Identity Analyst; integration performed by Guard Integration Engineer.

**Tools:** Guard CLI, catalog auditor, host registry API.

**Outputs:** Validated registry snapshot, collision report, invalidated approval IDs.

**Checkpoints:** After identity derivation; before registry swap; after approval invalidation.

**Metrics:** ambiguous aliases, rejected entries, identity churn, catalog validation duration.

**Retry policy:** At most 1 retry after obtaining a fresh tool list. A second mismatch stops admission.

**Stop conditions:** Valid catalog installed or affected server instance disabled pending review.

**Failure path:** Preserve old known-good snapshot if safe; otherwise disable affected tools and escalate.

**Verification:** Auditor returns clean and resolver produces exactly one ID per exposed alias.

**Definition of Done:** No blocking catalog findings, all exposed entries have canonical IDs, and stale approvals are invalidated.

---

## Workflow 2 — Guarded Tool Invocation

**Trigger:** Model or user requests an MCP tool.

**Goal:** Guarantee the approved/policy-selected identity is the live identity actually dispatched.

**Inputs:** Model-facing alias, arguments, current registry, approval policy, live connection table.

**Baseline:** Record request ID and registry generation before resolution.

**Stages:**
1. Resolve alias to exactly one canonical ID.
2. Validate arguments against the registered input schema.
3. Determine approval requirement using canonical ID.
4. If prompted, bind decision to canonical ID, origin fingerprint, schema digest, generation, and optionally argument digest.
5. Immediately before dispatch, load the live registry/connection record again.
6. Run `tool_identity_guard.py verify-invocation` against approval and live entry.
7. Dispatch only on exact match.
8. Record dispatcher connection identity and correlate it with approval.

**Responsible agent:** Runtime host; deterministic guard owns the final check.

**Tools:** Resolver, approval store, guard CLI, dispatcher.

**Outputs:** Allow/prompt/deny result and audit event.

**Checkpoints:** Before approval; immediately before dispatch; after dispatch correlation.

**Metrics:** ambiguity denials, stale-generation denials, origin mismatch denials, approval-to-dispatch match rate.

**Retry policy:** No automatic retry on identity mismatch. One re-resolution is allowed only after a deliberate registry refresh, and a new approval is required if identity changes.

**Stop conditions:** Exact identity dispatched or invocation denied/escalated.

**Failure path:** Deny, log mismatch, invalidate affected approval, optionally quarantine the alias.

**Verification:** Audit record proves approval and dispatcher canonical IDs match.

**Definition of Done:** Invocation either executes on the approved origin or is blocked before side effects.

---

## Workflow 3 — Identity Regression Gate

**Trigger:** Release, registry adapter change, MCP framework upgrade, naming-normalization change.

**Goal:** Detect regressions in identity binding before deployment.

**Inputs:** Test catalog fixtures and implementation under review.

**Baseline:** Capture current pass/fail and collision-detection counts.

**Stages:**
1. Run unit tests.
2. Run catalog fixtures with duplicate tool names across servers.
3. Run duplicate server-reported names with distinct host instance IDs.
4. Run case/separator normalization collision fixtures.
5. Run stale-generation approval fixture.
6. Run schema-drift fixture.
7. Independently inspect the dispatcher call site to ensure canonical identity is not reduced to a display name.
8. Compare metrics to baseline.

**Responsible agent:** Independent Security Verifier.

**Tools:** Python unittest, guard CLI, catalog auditor, source inspection.

**Outputs:** Verification report and release decision.

**Checkpoints:** After deterministic tests and after independent dispatch review.

**Metrics:** blocked attack fixtures, benign fixture success, audit field coverage.

**Retry policy:** Maximum 1 implementation-fix cycle per discovered defect during the gate; repeated failure blocks release.

**Stop conditions:** All security fixtures pass or release is blocked.

**Failure path:** Return defect evidence to integration engineer; do not weaken rules to make tests pass.

**Verification:** Independent verifier signs off on evidence, not implementation claims.

**Definition of Done:** All required fixtures are blocked/allowed as expected and policy-to-dispatch identity continuity is proven.

---

## Workflow 4 — Wrong-Origin Incident Response

**Trigger:** Evidence that a tool may have run against an unexpected server/session/project.

**Goal:** Stop further wrong-origin calls, preserve evidence, find the identity break, and prevent recurrence.

**Inputs:** Invocation ID, registry history, approval logs, dispatcher logs, server configuration.

**Baseline:** Snapshot affected live connections and approvals before mutation.

**Stages:** Quarantine affected aliases → preserve evidence → reconstruct approved identity → reconstruct dispatched origin → locate mismatch layer → invalidate identities/approvals → add regression fixture → patch → independently verify → cautiously re-enable.

**Responsible agent:** Registry Identity Analyst for evidence; Guard Integration Engineer for patch; Independent Security Verifier for release.

**Tools:** Logs, scanner, guard CLI, tests.

**Outputs:** Incident record, root cause, containment evidence, regression test.

**Checkpoints:** Before reconnect/reset; before re-enable.

**Metrics:** time to quarantine, affected calls, identity reconstruction coverage.

**Retry policy:** No blind retries of the failing tool. One controlled reproduction in an isolated test environment if safe.

**Stop conditions:** Identity integrity restored and verified, or incident escalated.

**Failure path:** Keep tool disabled if origin cannot be proven.

**Verification:** New fixture fails on old behavior and passes with the guard.

**Definition of Done:** No unresolved identity ambiguity remains and external side effects have an explicit human-reviewed disposition.