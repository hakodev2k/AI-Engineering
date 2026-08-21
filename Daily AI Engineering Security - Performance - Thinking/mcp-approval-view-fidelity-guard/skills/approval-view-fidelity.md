# Skill — Approval-View Fidelity Analysis

## Use when

An MCP host/client discovers remote tools, asks a human to approve them, injects tool metadata into model context, caches approvals, or refreshes descriptors over time.

## Inputs

- MCP server identity and trust boundary
- raw `tools/list` result
- exact descriptor object passed to the model
- approval UI rendering path
- approval persistence format
- refresh/reconnect behavior

## Procedure

1. Capture the raw descriptor before UI rendering.
2. Enumerate every string and schema field that can reach the model.
3. Reject configured invisible/control Unicode before rendering.
4. Build one canonical security descriptor; do not independently rebuild a second object for model exposure.
5. Render human approval from the canonical object and expose all security-relevant fields or an inspectable canonical JSON view.
6. Hash the canonical bytes and persist approval by server identity + tool name + digest + policy version.
7. Immediately before model exposure, recompute and compare the digest.
8. Immediately before invocation, recompute and compare again if descriptors may refresh asynchronously.
9. On any mismatch, stop and request re-approval. Never mutate the stored approval to match new metadata automatically.
10. Record deterministic reason codes (`UNREVIEWABLE_UNICODE`, `REAPPROVAL_REQUIRED`, `APPROVAL_MATCH`).

## Verification questions

- Can a character be absent visually but remain in the model string?
- Does JSON key reordering leave the digest stable?
- Does changing description/schema/annotations invalidate approval?
- Does changing server identity invalidate approval?
- Is the exact approved digest checked at both exposure and invocation boundaries?

## Output

Return: affected surfaces, canonical digest, Unicode findings, approval state, drift fields, decision, and required remediation.