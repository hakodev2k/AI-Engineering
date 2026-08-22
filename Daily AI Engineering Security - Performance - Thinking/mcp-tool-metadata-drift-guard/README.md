# MCP Tool Metadata Drift Guard

**Category:** Security

## Problem
MCP clients can approve a server/tool once and later receive changed tool descriptions, schemas, or risk annotations. Those fields influence model behavior and host decisions, so post-approval drift creates a tool-poisoning/rug-pull path.

## Evidence
See `evidence/research.md`. Current evidence includes MCP discussion #2913 on signed manifests for rug-pull defense, the official MCP Tool Annotations guidance that annotations are untrusted hints rather than enforcement, OWASP MCP03 tool-poisoning guidance, and the MCP trust model.

## Existing approach and limitations
Admission-time review and static scanning help but do not necessarily detect later changes. Tool annotations can inform risk but are not contracts. Signed manifests improve integrity when available, but signatures still do not prove benign runtime behavior.

## Proposed improvement
Pin a canonical security-relevant tool manifest to the approved server identity. Recompute and compare it on reconnect/discovery refresh and before high-impact calls. Any relevant drift becomes `review_required`; identity mismatch is denied. Keep normal sandbox, authorization, network, and secret controls enabled.

## Architecture
- `evidence/research.md` — public evidence and analysis
- `config/policy.json` — fields and blocking policy
- `scripts/manifest_guard.py` — pin/verify/diff implementation
- `skills/manifest-drift-review.md` — reusable procedure
- `rules/metadata-trust-rules.md` — enforceable trust rules
- `subagents/security-verifier.md` — independent verifier
- `workflows/admission-and-reconnect-verification.md` — bounded lifecycle workflow
- `hooks/pre-tool-refresh-check.md` — deterministic refresh gate
- `tests/test_manifest_guard.py` — canonicalization and mutation tests

## Installation
Python 3.10+; no third-party packages.

## Configuration
Review `config/policy.json`. `security_fields` should include every metadata field used for model context, authorization, approval, or retry behavior. Do not use annotations as hard guarantees unless backed by separate enforcement.

## Usage
Initial approved pin:
`python scripts/manifest_guard.py pin current-tools.json approved-snapshot.json --server-id <id> --policy config/policy.json`

Reconnect/refresh verification:
`python scripts/manifest_guard.py verify current-tools.json approved-snapshot.json --server-id <id> --policy config/policy.json`

## Workflow
Capture baseline host behavior, pin reviewed metadata, verify every refresh, quarantine changed tools, show a field-level diff, require explicit re-review, then replace the snapshot only after approval. Independent verification tests mutation and canonical-equivalence cases.

## Metrics
Drift detection rate, false drift rate, silent execution after drift, approval-binding coverage, verification latency, identity mismatch blocks.

## Verification
Required fixtures: unchanged manifest, JSON key reorder, changed description, changed schema, changed annotation, added tool, removed tool, and server identity mismatch. Target: 100% security-relevant mutation detection, zero false drift for key order, zero silent changed-tool execution.

## Safety
A matching digest does not prove runtime behavior is safe. Preserve least privilege, human approval for dangerous operations, sandboxing, network controls, secret boundaries, output validation, and per-call authorization. A signed manifest is an additional signal, not a substitute for these controls.

## Failure handling
Detection: unreadable snapshot, invalid discovery data, drift, or identity mismatch. Retry: at most one retry for a transient discovery/read failure. Drift is not retried; it requires review. Fallback: keep the last approved snapshot and block affected changed tools. Escalate identity/integrity failures to the security owner.

## Definition of Done
**Implemented:** pin/verify gate integrated. **Measured:** baseline and mutation test results recorded. **Verified:** all mutation fixtures blocked, canonical-equivalent manifests pass, identity mismatch denied, approval binds the new digest, and runtime security controls remain unchanged.

## Customization
Production clients can replace local snapshot files with a signed audit store, add trusted manifest-signature verification, or integrate policy engines. Preserve canonicalization, identity binding, explicit drift review, bounded failure handling, and independent verification.
