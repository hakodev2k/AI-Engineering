# Provider Capability Contract Preflight

**Category:** Performance

## Problem
OpenAI-compatible Responses endpoints can support the protocol while rejecting newer or proprietary request features such as namespace tools, `additional_tools`, or Responses-Lite-specific shapes. Long-running agents then fail before inference, repeatedly retry deterministic errors, or lose Guardian/tool functionality.

## Evidence
See `evidence/research.md`. Current reports include independent Azure and generic-provider failures with controlled A/B evidence, including a 2026-08-19 Guardian regression.

## Existing approach
Users typically disable features, override model catalogs, downgrade, or run request-rewriting proxies after a failure occurs.

## Existing limitations
These mitigations are reactive, brittle, and may silently remove required approval/tool semantics. Generic retries add latency without changing deterministic schema errors.

## Proposed improvement
Negotiate a concrete provider capability contract before task execution. Preflight each distinct request lane, select only supported features, cache evidence with strict identity/version keys, and block unsupported required semantics rather than retrying blindly.

## Architecture
- `skills/capability-contract-analysis.md` — evidence-driven negotiation procedure.
- `rules/provider-compatibility-rules.md` — observable invariants.
- `subagents/provider-compatibility-verifier.md` — independent verifier.
- `workflows/preflight-benchmark-verify.md` — baseline/remediation workflow.
- `hooks/pre-dispatch-capability-gate.md` — deterministic blocking hook.
- `scripts/capability_gate.py` — machine-readable capability validator.
- `evidence/research.md` — public evidence and root-cause analysis.

## Package tree
```text
README.md
evidence/research.md
skills/capability-contract-analysis.md
rules/provider-compatibility-rules.md
subagents/provider-compatibility-verifier.md
workflows/preflight-benchmark-verify.md
hooks/pre-dispatch-capability-gate.md
scripts/capability_gate.py
```

## Installation
Requires Python 3.9+. Integrate the hook before the first provider request and before separate Guardian/reviewer lanes.

## Configuration
Create `required-capabilities.json` as a JSON string array and `capability-matrix.json` as capability-to-boolean/evidence records. Key cached evidence by endpoint, API version, model, and client serializer version. Never store credentials.

## Usage
`python3 scripts/capability_gate.py --required required-capabilities.json --matrix capability-matrix.json`

Exit 0 = supported; 2 = invalid input; 3 = unsupported/unknown and BLOCK.

## Workflow
Measure baseline failures/retries → inspect exact request shapes → identify one failing feature → perform safe A/B/probe → select minimal compatible profile → run primary/review canaries → measure again → independent verification.

## Metrics
Deterministic 4xx rate, unchanged retry count, time to first successful inference, preflight latency, capability-cache hit rate, Guardian/reviewer success rate.

## Verification
A package is not verified merely because a primary prompt succeeds. Every required lane must pass a non-destructive canary, no undeclared extension may be serialized, deterministic 4xx errors must have zero unchanged retries, and the independent verifier must confirm no security/correctness downgrade.

## Safety
Never disable approval/review merely to make a provider compatible. Never expose authorization data in traces. Capability probing must be non-destructive.

## Failure handling
Detection: capability gate, request-schema 4xx, or canary failure. Evidence: redacted request/response and matrix. Retry: maximum two for transient failures; zero unchanged retries for deterministic incompatibility. Fallback: minimal safe feature profile. Escalation: operator/provider selection. Stop when a required capability remains unsupported or a fallback changes security semantics.

## Implemented / Measured / Verified
**Implemented:** preflight integration exists. **Measured:** before/after latency/retry/failure metrics exist. **Verified:** all required request lanes pass with equivalent semantics and independent review.

## Definition of Done
Public evidence documented; baseline captured; required contract explicit; unsupported assumptions identified; safe profile implemented; canaries pass; deterministic retries eliminated; metrics compared; secrets absent; security boundaries preserved; independent verifier PASS; no blocking capability remains.

## Customization
Extend capability names for provider-specific features, add schema probes for new Responses fields, and replace file-based matrices with a signed or centralized registry while preserving explicit support evidence and bounded TTLs.