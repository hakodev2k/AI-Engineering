# Workflow — Approval and Drift Gate

## Phase A — Discovery

1. Receive `tools/list` from one authenticated server connection.
2. Attach a stable host-resolved server identity; do not infer origin from tool text.
3. Extract the security descriptor fields configured by policy.
4. Run the descriptor guard. A Unicode finding stops the workflow before approval.

## Phase B — Human approval

1. Serialize the canonical descriptor.
2. Render the approval surface from that canonical object.
3. Show server identity, tool name, description, schemas/annotations relevant to behavior, and the digest (short prefix is acceptable if full digest is inspectable).
4. If approved, persist `(server, tool, descriptorSha256, policyVersion)`.
5. If rejected, persist no allow record.

## Phase C — Model exposure

1. Refresh/read the descriptor that will actually be injected.
2. Re-run Unicode validation and canonical hashing.
3. Compare against the approval record.
4. On mismatch: withhold the tool from model context and queue human re-approval.
5. On exact match: expose only the checked descriptor.

## Phase D — Invocation

When descriptors can change asynchronously, recompute the digest immediately before the call. If it differs, cancel the call and require re-approval. Inputs/arguments still require the host's normal sensitive-action approval policy; descriptor approval does not replace per-call authorization.

## Phase E — Refresh/reconnect

On server reconnect, package upgrade, `tools/list_changed`, or periodic metadata refresh:

- compare canonical digests;
- keep approvals only for exact matches;
- mark changed descriptors `REAPPROVAL_REQUIRED`;
- never auto-promote a new digest.

## CI regression

Run:

```bash
python scripts/test_guard.py
```

The suite must demonstrate clean approval, exact verification, key-order stability, drift invalidation, TAG-block rejection, and server binding.