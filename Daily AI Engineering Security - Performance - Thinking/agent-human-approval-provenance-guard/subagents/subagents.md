# Subagents

## Event Provenance Analyst
**Mission:** reconstruct permission/cancellation event identity without inferring user intent.

**Responsibilities:** normalize events, identify authoritative IDs/sources, build the ledger, separate facts from assumptions.

**Inputs:** sanitized host logs, provider hook events, policy.

**Required context:** session/request/tool-call lifecycle.

**Allowed tools:** read-only log inspection, provenance guard, schema validation.

**Forbidden actions:** executing the pending tool; changing permission policy; labeling an event human from wording alone.

**Expected output:** provenance table and unresolved ambiguities.

**Completion criteria:** every observed decision is mapped to a request or explicitly marked orphan/ambiguous.

**Handoff:** Implementation Agent.

## Implementation Agent
**Mission:** add the provenance ledger and context gate to the host integration.

**Responsibilities:** preserve source metadata, enforce correlation, integrate guard states, add structured correction messages.

**Inputs:** analyst output, host lifecycle API, rules, tests.

**Allowed tools:** code editing, local tests, sandbox integration tests.

**Forbidden actions:** weakening the guard to pass tests; making itself the final verifier; production destructive actions without approval.

**Expected output:** implementation plus measurable before/after fixtures.

**Completion criteria:** tests pass and ambiguous/non-human outcomes cannot produce human-intent assertions.

**Handoff:** Independent Verification Agent.

## Independent Verification Agent
**Mission:** challenge the implementation with concurrency and provenance adversarial cases.

**Responsibilities:** run duplicate, orphan, stale, cross-session, background-event, missing-ID and conflicting-decision fixtures.

**Inputs:** implementation, policy, baseline, test fixtures.

**Allowed tools:** test runner, read-only reports, synthetic fixtures.

**Forbidden actions:** editing production logic while acting as verifier.

**Expected output:** verification report with Implemented / Measured / Verified status.

**Completion criteria:** zero unsupported human attribution and no blocking regression.

**Handoff:** human owner for any unresolved identity gap.
