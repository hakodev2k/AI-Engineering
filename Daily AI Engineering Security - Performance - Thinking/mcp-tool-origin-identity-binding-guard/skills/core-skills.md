# Core Skills

## Skill 1 — Build a Canonical MCP Tool Identity

**Purpose:** Convert an MCP registration into a host-controlled security identity that survives display-name ambiguity.

**Trigger:** A tool is discovered, registered, refreshed, or reconnected.

**Inputs:** Host-assigned server instance ID, transport configuration, connection generation, protocol tool name, input schema.

**Preconditions:** The host knows which configured server instance owns the live connection. Server-reported names are treated as descriptive metadata only.

**Required context:** Current identity policy, trusted server configuration, transport type, live generation, exact schema.

**Tools:** `scripts/tool_identity_guard.py`, JSON parser, host registry API.

**Procedure:**
1. Validate required fields and reject blank instance IDs or tool names.
2. Canonicalize transport identity without resolving through server-provided display data.
3. Canonically serialize the input schema and compute its SHA-256 digest.
4. Compute an origin fingerprint from trusted transport configuration.
5. Construct the tuple `instance_id | origin_fingerprint | generation | tool_name | schema_digest`.
6. Hash the tuple to a canonical ID.
7. Store display alias separately from canonical ID.
8. Compare against the live registry; reject duplicate canonical IDs with inconsistent metadata and reject aliases that resolve to more than one canonical ID.
9. Persist the identity record and generation atomically before exposure to the model.

**Decisions:** If the same logical tool changes schema or origin, create a new identity/generation and invalidate old approvals. If only presentation metadata changes, preserve identity.

**Constraints:** Never use `serverInfo.name`, display alias, normalized model-facing name, or array position as the authorization key.

**Expected output:** A deterministic identity record containing canonical ID, exact tool name, schema digest, origin fingerprint, generation, and display alias.

**Metrics:** Registry coverage, ambiguous alias count, identity churn rate, approval invalidation count.

**Verification:** Recompute the ID independently from serialized inputs and compare byte-for-byte.

**Failure handling:** Fail registration closed; preserve metadata for diagnosis; do not expose the ambiguous tool.

**Stop conditions:** Identity validates and is unique, or registration is denied with evidence.

---

## Skill 2 — Bind Approval and Policy to Tool Origin

**Purpose:** Ensure a user or policy decision authorizes the exact capability that will be dispatched.

**Trigger:** A tool requires approval, policy lookup, or privileged routing.

**Inputs:** Canonical tool ID, current registry record, requested arguments, approval scope, live connection generation.

**Preconditions:** Skill 1 completed successfully.

**Required context:** Approval policy, current registry snapshot, identity policy, live connection ownership.

**Tools:** Host approval store, `tool_identity_guard.py verify-invocation`.

**Procedure:**
1. Resolve the model-facing alias to exactly one canonical ID.
2. Capture canonical ID, schema digest, origin fingerprint, generation, and argument digest in the approval request.
3. Present the human-readable server configuration/origin and exact tool arguments for sensitive operations.
4. Store approval against the canonical ID and declared scope, never against alias alone.
5. Immediately before dispatch, reload the live registry entry.
6. Revalidate canonical ID, origin fingerprint, schema digest, and generation.
7. If any bound field changed, invalidate the approval and require a new decision.
8. Emit an audit record joining approval decision and dispatch identity.

**Decisions:** A schema/origin/generation change is a new security principal. Harmless argument changes may still require re-approval according to policy; dangerous arguments should be bound explicitly.

**Constraints:** No fallback from canonical identity to fuzzy tool-name matching.

**Expected output:** `ALLOW`, `PROMPT`, or `DENY` with identity evidence.

**Metrics:** Stale approval blocks, mismatched dispatch blocks, approvals by canonical ID, alias-resolution failures.

**Verification:** Compare approval record identity with the identity passed to the concrete transport dispatcher.

**Failure handling:** Deny on missing registry entry, multiple alias candidates, stale generation, or fingerprint mismatch.

**Stop conditions:** Exact identity is authorized and dispatchable, or the call is denied/escalated.

---

## Skill 3 — Audit a Multi-Server Tool Catalog

**Purpose:** Detect collisions, ambiguous aliases, reused server labels, normalization conflicts, and stale generations before runtime.

**Trigger:** Startup, MCP configuration change, connector refresh, CI validation, or incident investigation.

**Inputs:** Catalog JSON containing registered tool identity records.

**Preconditions:** Catalog contains trusted configuration-derived origin data.

**Required context:** Alias-normalization rules used by the host/model adapter.

**Tools:** `scripts/audit_tool_catalog.py`.

**Procedure:**
1. Parse every catalog entry and validate required identity fields.
2. Group by canonical ID and flag inconsistent duplicates.
3. Group by display alias and normalized alias; flag groups with multiple canonical IDs.
4. Group by server-reported name and show when multiple host instance IDs share it.
5. Detect the same instance/tool combination registered under multiple live generations.
6. Detect origin or schema drift without generation advancement.
7. Produce machine-readable findings with severity and affected IDs.
8. Block deployment for ambiguity or identity inconsistency; warn for non-security presentation collisions that are already disambiguated.

**Decisions:** A duplicate display label is acceptable only when the user/model-facing resolver uses an unambiguous host alias and policy never keys on the duplicate label.

**Constraints:** Scanner is metadata-only and must not contact tools or execute server code.

**Expected output:** JSON report and exit code suitable for CI.

**Metrics:** Collision count, drift count, reused server-name count, blocked registry entries.

**Verification:** Seed synthetic collision fixtures and confirm deterministic findings.

**Failure handling:** Invalid input returns a distinct nonzero exit code; security findings return a blocking exit code.

**Stop conditions:** Catalog passes or blocking findings are remediated/escalated.

---

## Skill 4 — Investigate Wrong-Origin Tool Execution

**Purpose:** Contain and diagnose an incident where a tool may have executed against the wrong server/session/project.

**Trigger:** Unexpected side effect, wrong project directory, mismatched server logs, or audit identity mismatch.

**Inputs:** Invocation ID, approval record, registry snapshots, transport logs, connection generation history.

**Preconditions:** Incident handling is authorized; evidence is preserved read-only.

**Required context:** Expected canonical ID and observed dispatcher connection.

**Tools:** Audit logs, catalog scanner, registry export.

**Procedure:**
1. Stop further invocations for the affected alias and canonical IDs.
2. Preserve registry, approval, and dispatcher logs.
3. Reconstruct expected canonical ID at approval time.
4. Reconstruct actual connection origin used at dispatch.
5. Compare instance ID, origin fingerprint, generation, tool name, and schema digest.
6. Identify the first layer where identity changed or was reduced to a presentation string.
7. Invalidate approvals and caches for affected identities.
8. Rotate/reconnect server instances only after evidence capture.
9. Add a regression fixture reproducing the mismatch.
10. Re-enable only after independent verification.

**Decisions:** If origin cannot be proven, treat the invocation as untrusted and require human review of resulting side effects.

**Constraints:** Do not destroy logs or auto-revert potentially destructive external effects without explicit approval.

**Expected output:** Incident timeline, identity mismatch point, containment actions, regression evidence.

**Metrics:** Time to containment, identity reconstruction coverage, recurrence rate.

**Verification:** Independent verifier reproduces the mismatch or confirms the new guard blocks the fixture.

**Failure handling:** Escalate when evidence is incomplete or external side effects cannot be safely assessed.

**Stop conditions:** Incident is contained and identity integrity is restored, or ownership is escalated.