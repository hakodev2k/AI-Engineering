# Subagent Result Instruction Quarantine Guard

**Category:** Security

## Problem
Delegated research can return poisoned action guidance in a trusted-looking final result. The parent often receives only the child's final text, so untrusted instructions can cross a delegation boundary without the provenance needed to distinguish evidence from commands.

## Evidence
See `evidence/research.md`. Current 2026 signals include Claude Code issues #88134 and #77644 plus OWASP indirect prompt-injection guidance.

## Existing approach and limitation
Classifiers, sandboxing, permission prompts, isolated child contexts, and manual review help, but they do not make every child claim attributable or prevent a read-only result from becoming implicit mutation guidance.

## Proposed improvement
Require a structured result envelope and deterministic admission decision before parent consumption. Quarantine explicit protected-data/exfiltration patterns; review unsolicited mutation or missing provenance; independently re-derive privileged actions.

## Architecture
- `evidence/research.md` — current signals, approaches, limitations, root cause.
- `skills/validate-subagent-result.md` — reusable validation procedure.
- `rules/subagent-result-trust-boundary.md` — enforceable trust rules.
- `subagents/result-security-reviewer.md` — independent review role.
- `workflows/admit-subagent-result.md` — bounded admission lifecycle.
- `hooks/pre-parent-admission.md` — blocking integration point.
- `scripts/quarantine_result.py` — dependency-free deterministic validator.
- `tests/test_quarantine.py` — malicious/benign regression cases.

## Installation
Requires Python 3.9+ and no third-party packages. Copy the directory into the host's reusable engineering controls.

## Configuration
Hosts should extend protected-data and persistence patterns conservatively and define which delegation task types are read-only. Pattern changes require regression tests.

## Usage
Create a JSON result envelope and run:

`python3 scripts/quarantine_result.py < result.json`

Exit codes: `0 allow`, `2 review`, `3 quarantine`, `4 invalid/failure`.

## Workflow
Observe child result → validate → diagnose findings → independently review ambiguous cases → admit sanitized evidence or quarantine → verify no privileged action preceded admission.

## Metrics
Provenance coverage; quarantine rate; unsupported-action rate; privileged actions initiated from unverified child text; false-positive rate; verifier disagreement.

## Verification
Run `python3 tests/test_quarantine.py`. A successful run must allow the benign cited research case, quarantine the secret/persistence exfiltration case, and require review for unsupported mutation/missing provenance.

## Safety
The validator never executes child commands. Nonzero exit codes block automatic admission. Quarantine findings must be passed in sanitized form rather than replaying executable payload text into a mutation-capable agent.

## Failure handling
Detection: invalid JSON/schema, suspicious patterns, missing provenance, or reviewer disagreement. Evidence: validator JSON output plus source links. Retry: one schema repair attempt only. Fallback: independent read-only review. Escalation: human review for privileged actions. Stop condition: unresolved risk after one review.

## Definition of Done
- **Implemented:** deterministic gate, hook contract, rules, reviewer, and tests exist.
- **Measured:** host records admission/provenance/security metrics.
- **Verified:** regression tests pass; quarantined output cannot authorize mutation; permission boundaries remain unchanged; no secrets are exposed.

## Customization
Add organization-specific secret identifiers, sensitive path patterns, allowed task types, and provenance policies. Never weaken the parent permission boundary to reduce review friction.
