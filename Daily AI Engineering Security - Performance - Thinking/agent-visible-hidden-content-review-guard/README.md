# Agent-Visible Hidden Content Review Guard

**Category:** Security

## Problem
AI coding/review agents may receive attacker-controlled content that a human reviewer does not visibly perceive—HTML comments, hidden markup, zero-width characters, or externally ingested diagnostic text—and then execute privileged actions based on it.

## Evidence
See `evidence/research.md` for current public evidence and source links.

## Existing approach
Prompt-injection filters, human approvals, sandboxing, source allowlists, and least privilege reduce risk.

## Existing limitations
Human approval is weak when the reviewer cannot see the same content the agent consumed. Pattern filters are bypassable, and trusted-service provenance does not imply trusted content when fields are externally writable.

## Proposed improvement
Create a review-input parity gate that detects agent-visible/human-invisible content, preserves field-level provenance, blocks hidden instruction-bearing channels, and requires privileged actions to cite human-visible evidence.

## Architecture
```text
agent-visible-hidden-content-review-guard/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-agent-review.md
├── rules/review-input-boundary.md
├── scripts/review_visibility_guard.py
├── skills/review-input-threat-analysis.md
├── subagents/security-verifier.md
├── tests/test_review_visibility_guard.py
└── workflows/inspect-and-verify.md
```

## Installation
Python 3.10+. No third-party dependencies.

## Configuration
Edit `config/policy.json` to define maximum input size, hidden-content controls, and privileged action classes. Do not disable visible-evidence requirements for sensitive actions merely to reduce friction.

## Usage
```bash
python scripts/review_visibility_guard.py --input review.md --policy config/policy.json
```
For privileged actions, also pass `--requested-action` and a human-visible evidence string through `--visible-evidence`.

## Workflow
Follow `workflows/inspect-and-verify.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Implement quarantine/parity control → Measure again → independently verify.

## Metrics
Hidden-segment detection rate, invisible-character detection, privileged-action visible-evidence coverage, attack-fixture block rate, and false-positive review count.

## Verification
```bash
python -m unittest tests/test_review_visibility_guard.py
```
An independent Security Verifier must also confirm that hidden content cannot authorize a privileged action and that no secret values are logged.

## Safety
The package does not execute or rewrite reviewed content. A failed parity check is fail-closed for agent-driven privileged actions. Externally writable content remains data, not policy.

## Failure handling
If content parity cannot be established, block autonomous execution, preserve evidence, and route to a human-visible rendering. Maximum automated normalization/remediation retries: 1. Do not bypass a block by weakening permission or visibility requirements.

## Definition of Done
**Implemented:** parity guard, policy, hook, rule, skill, workflow, and independent verifier are integrated.  
**Measured:** hidden/invisible findings and privileged-action attempts are recorded.  
**Verified:** attack fixtures are blocked, benign visible content passes, visible evidence is required for privileged actions, no secrets are exposed, and an independent reviewer validates the trust boundary.

## Customization
Extend hidden-content detectors for the renderer used by your code-review platform, but preserve field-level provenance and visible-evidence binding for privileged actions.
