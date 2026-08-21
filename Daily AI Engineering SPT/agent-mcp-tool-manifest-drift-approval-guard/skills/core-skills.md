# Core Skills

## Skill 1 — Establish an Approved MCP Tool Baseline

**Purpose**: Create a deterministic, auditable record of the exact MCP tool surface a human or policy authority approved.

**Trigger**: First connection to an MCP server, server re-registration, or explicit re-approval after accepted drift.

**Inputs**: Exported current manifest JSON, server identity, approval identifier, `config/policy.json`.

**Preconditions**: The MCP server identity and endpoint have been independently validated. The approver can inspect tool descriptions, schemas, and annotations. The exported manifest came from the same server identity being approved.

**Required context**: Server ownership, intended use, expected tool set, destructive/data-access capabilities, authorization scopes.

**Tools**: `scripts/manifest_guard.py`, MCP client/export command, code review or human approval system.

**Procedure**:
1. Fetch `tools/list` through the normal authenticated MCP client.
2. Save only the manifest and stable server identity fields to a local JSON artifact; exclude access tokens and request headers.
3. Review every new tool for capability, data access, destructive effects, and schema sensitivity.
4. Record the external approval ticket/change identifier.
5. Run `manifest_guard.py snapshot` with the manifest, policy, baseline path, and approval id.
6. Store the baseline in a protected approval store or repository path that the MCP server cannot write.
7. Re-run `check` immediately against the same manifest; require exit code 0.

**Decisions**: Reject approval when server identity is ambiguous, manifest contains unexplained tools, descriptions request unrelated sensitive data, or schemas permit broader actions than intended.

**Constraints**: Never let the MCP server write its own approved baseline. Never infer approval from a valid signature alone. Never store credentials inside the baseline.

**Expected output**: `mcp-tool-approval-baseline/v1` JSON with canonical manifest, digest, approval id, and timestamp.

**Metrics**: approved tool count, baseline generation latency, number of high-risk tools reviewed, percentage of configured servers with baselines.

**Verification**: `check` returns pass for the exact approved manifest; baseline digest is stable across key/order-only changes.

**Failure handling**: If canonicalization fails or duplicate names exist, stop. If identity is uncertain, do not approve.

**Stop conditions**: Baseline generated, independently stored, and round-trip verified; otherwise no tool becomes agent-visible.

---

## Skill 2 — Reconcile Live Manifest Drift

**Purpose**: Prevent unreviewed MCP tool changes from silently entering agent planning or execution.

**Trigger**: Reconnect, `tools/list_changed`, TTL expiry, manual refresh, server/package upgrade, or security review.

**Inputs**: Live manifest, approved baseline, policy.

**Preconditions**: Baseline exists and is readable from a trusted store.

**Required context**: Current server identity, previously approved digest, change event source.

**Tools**: `scripts/manifest_guard.py check`.

**Procedure**:
1. Fetch the live manifest but hold changed/new tools outside the model-visible registry.
2. Run deterministic comparison against the approved baseline.
3. If no drift exists, publish the approved tool set to the agent.
4. If only non-blocking drift exists, record the report and follow organizational policy; do not update the baseline automatically unless policy explicitly allows it.
5. If high/critical drift exists, quarantine affected tools and block their invocation.
6. Produce a structured change report for a reviewer: added/removed tools, description/schema/annotation/identity changes, risk level.
7. If approved, create a *new* baseline using the separate snapshot workflow; never mutate approval state as a side effect of `check`.

**Decisions**: Re-approval is mandatory for server identity changes, new tools, description changes, input-schema changes, and safety-annotation changes under the default policy.

**Constraints**: Do not ask the LLM to decide whether drift is safe. The LLM may summarize an already-generated diff but cannot override the gate.

**Expected output**: Pass or blocked result plus machine-readable report.

**Metrics**: drift events/server/month, blocked high-risk changes, time-to-review, false-positive rate, guard latency.

**Verification**: Inject known drift fixtures and confirm affected tools remain unavailable before approval.

**Failure handling**: On baseline read failure, parser error, oversized manifest, or unknown risk class, fail closed for affected server tools.

**Stop conditions**: Either current manifest matches approved state, or drift is blocked/quarantined with an escalation artifact.

---

## Skill 3 — Approve Legitimate Drift Safely

**Purpose**: Allow legitimate server evolution without turning the baseline into an auto-trust cache.

**Trigger**: Security/change reviewer accepts a blocked manifest diff.

**Inputs**: Blocked change report, live manifest, reviewer decision, new approval id.

**Preconditions**: Reviewer has access to server release notes/source/package provenance where applicable and understands authorization impact.

**Procedure**:
1. Validate that the live server identity is expected.
2. Review each diff item and map it to intended release/change evidence.
3. Re-evaluate required OAuth scopes, filesystem/network reach, and human-approval boundaries for changed capabilities.
4. Test changed tools in a non-production/sandbox account when destructive or data-sensitive.
5. Obtain explicit approval with immutable identifier.
6. Snapshot the new manifest to a new baseline revision.
7. Preserve the prior baseline and drift report for audit.
8. Re-run check and a representative safe tool call before restoring normal availability.

**Constraints**: No approval based solely on tool name stability. No approval if the reviewer cannot explain a high/critical diff.

**Expected output**: New approved baseline revision and verification record.

**Metrics**: approval lead time, rejected drift count, post-approval incident rate.

**Verification**: New manifest passes; old-to-new report is archived; policy boundaries remain enforced.

**Failure handling**: Keep changed tools quarantined. Roll back client/server version if operationally necessary and safe.

**Stop conditions**: New baseline is approved and verified, or drift remains blocked.
