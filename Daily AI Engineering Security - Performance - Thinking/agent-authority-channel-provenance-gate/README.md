# Agent Authority Channel Provenance Gate

## Topic
Authenticated provenance for user/system authority channels in agent runtimes.

## Category
Security

## Problem
Model, tool, subagent, reminder, and genuine user/system messages can share one model-visible stream. When privilege is reconstructed from plaintext markers, untrusted content can impersonate an authority-bearing channel.

## Evidence
See `evidence/research.md` for August 2026 reports from Claude Code and Hermes Agent involving fabricated USER messages, spoofed system reminders, and forgeable out-of-band steering markers.

## Existing approach and limitation
Prompt warnings, tag filtering, and provider role separation help but do not authenticate the origin of text after internal relay/serialization. A model-visible marker is forgeable.

## Proposed improvement
Enforce immutable source/authentication metadata before role normalization. Only trusted adapters may mint user/system authority; all other role-like content remains data.

## Architecture
- deterministic validator: `scripts/authority_gate.py`
- regression fixtures: `tests/test_authority_gate.py`
- enforceable policy: `rules/authority-boundary.md`
- review procedure: `skills/review-message-provenance.md`
- independent verification: `subagents/security-verifier.md`
- bounded rollout: `workflows/integrate-and-verify.md`
- pre-model enforcement hook: `hooks/pre-model-authority-gate.md`
- current evidence: `evidence/research.md`

## Actual package tree
```text
README.md
evidence/research.md
hooks/pre-model-authority-gate.md
rules/authority-boundary.md
scripts/authority_gate.py
skills/review-message-provenance.md
subagents/security-verifier.md
tests/test_authority_gate.py
workflows/integrate-and-verify.md
```

## Installation
Requires Python 3.9+ only; the validator has no third-party dependencies. Copy the package and integrate the hook immediately before model-role serialization.

## Configuration
Pass explicit comma-separated trusted source sets. Keep user and system producers separate and narrowly scoped. Do not use wildcard trust.

## Usage
Validate a redacted event batch:
`python3 scripts/authority_gate.py events.jsonl`

Run regression tests:
`python3 tests/test_authority_gate.py`

## Event shape
Each JSONL object should carry `role`, `source`, `authenticated`, `authority`, and `content`. Correlation IDs are strongly recommended in the host integration.

## Workflow
Follow `workflows/integrate-and-verify.md`: observe → baseline → diagnose → hypothesis → implement → measure again → independent verification. Maximum remediation cycles: 3.

## Metrics
Unauthorized authority promotions, authenticated provenance coverage, spoof-marker detections, legitimate-message false positives, and regression pass rate.

## Verification
**Implemented** means the gate exists in the pre-model path. **Measured** means baseline and post-change events have been scanned. **Verified** means malicious promotions are blocked, legitimate ingress passes, tests pass, and `subagents/security-verifier.md` independently returns PASS.

## Safety
Fail closed on missing provenance. Do not expose secrets in diagnostics, widen trusted source sets to restore compatibility, or treat sanitization as authentication. High-risk exceptions require explicit human approval.

## Failure handling
Detection is the blocking validator result. Preserve redacted evidence, retry implementation at most 3 times with a changed hypothesis, then escalate. Never downgrade authority checks to hide a failure.

## Definition of Done
Evidence documented; all authority producers mapped; baseline captured; trusted ingress authenticated; untrusted promotions blocked; tests pass; legitimate paths pass; independent verification PASS; risks documented; no blocking issue remains.

## Customization
Extend trusted adapters and marker telemetry for your transport, but preserve the core invariant: authority comes from authenticated provenance, not content.
