# Persistent Hook Approval Provenance Gate
**Category:** Security

## Problem
Persistent AI-agent hooks can cross a security boundary when model/PTY input, stale workspace state, or reflected hashes are treated as trustworthy approval.

## Evidence
Current public evidence and limitations are documented in `evidence/research.md`.

## Existing approach
Per-hook hashes, Workspace Trust, sandboxing and human review provide useful controls but can be bypassed when approval provenance and lifecycle execution are checked in different layers.

## Proposed improvement
Bind exact hook hash + authoritative cwd + lifecycle event + authenticated approval origin at one deterministic pre-execution gate.

## Actual package tree
```
README.md
config/policy.json
evidence/research.md
hooks/pre-hook-execution.md
rules/hook-trust-boundary.md
scripts/hook_trust_guard.py
skills/hook-trust-analysis.md
subagents/security-reviewer.md
tests/test_hook_trust_guard.py
workflows/diagnose-and-remediate.md
workflows/regression-verification.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Edit `config/policy.json` only through security review. Trusted human origins should name actual authenticated product surfaces, not strings supplied by a model.

## Usage
`python scripts/hook_trust_guard.py --event event.json --policy config/policy.json`

## Workflow
Use `workflows/diagnose-and-remediate.md` for incidents and `workflows/regression-verification.md` for changes.

## Metrics
Known execution-path coverage, false-allow count, stale-hash block rate, nonhuman-approval block rate, valid-case pass rate.

## Verification
`python -m unittest tests/test_hook_trust_guard.py`

## Safety
Fail closed. Do not log secrets. Do not let the implementing agent be the sole verifier. Dangerous/irreversible hook effects require explicit human authorization.

## Failure handling
Detection is deterministic. Retry remediation at most twice. If provenance or authoritative cwd remains ambiguous, disable the affected hook path and escalate.

## Definition of Done
**Implemented:** central gate integrated before every hook lifecycle execution path.  
**Measured:** all baseline and exploit fixtures executed.  
**Verified:** tests pass, independent reviewer confirms zero false allows, no secrets exposed.

## Customization
Add lifecycle events and managed-policy origins only when the host can cryptographically or structurally establish their provenance.
