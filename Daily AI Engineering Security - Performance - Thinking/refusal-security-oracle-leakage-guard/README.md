# Refusal Security-Oracle Leakage Guard

**Category:** Security

## Problem
A safety refusal can be correct yet still expose enough non-public implementation detail to help an adaptive attacker map hidden parameters, routes, guardrails, or bypass preconditions. Recent CoSnitch research showed iterative refusal questioning revealing an undocumented Microsoft Copilot parameter; separate 2026 research demonstrates black-box inference of guardrail behavior from observable signals.

## Evidence
See `evidence/research.md` for observed evidence, interpretation, existing approaches, remaining limitations, and sources.

## Existing approach and limitations
Generic non-disclosure prompts, static refusal templates, and allow/refuse classifiers reduce risk but do not measure cumulative reconnaissance value across turns or transport-level side channels. A model may also be given more internal diagnostic detail than it needs.

## Proposed improvement
Make refusal behavior an explicit security boundary: minimize sensitive control-plane context, scan denials for configured identifiers/patterns, test adaptive multi-turn probes, and independently verify high-severity remediations.

## Architecture
- `config/policy.json` — deterministic leak policy.
- `scripts/refusal_leak_scanner.py` — dependency-free response scanner.
- `tests/test_refusal_leak_scanner.py` — executable regression tests.
- `skills/refusal-leak-audit.md` — evidence-driven audit procedure.
- `rules/refusal-boundary.md` — enforceable response-boundary rules.
- `subagents/security-reviewer.md` — independent verifier contract.
- `workflows/audit-and-harden.md` — bounded remediation workflow.
- `hooks/pre-release-refusal-leak-check.md` — release gate.
- `evidence/research.md` — research record.

## Package tree
```text
refusal-security-oracle-leakage-guard/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-release-refusal-leak-check.md
├── rules/refusal-boundary.md
├── scripts/refusal_leak_scanner.py
├── skills/refusal-leak-audit.md
├── subagents/security-reviewer.md
├── tests/test_refusal_leak_scanner.py
└── workflows/audit-and-harden.md
```

## Installation
Requires Python 3.10+ only. No third-party packages are needed.

## Configuration
Replace placeholder `sensitive_terms` in `config/policy.json` with non-secret identifiers. Never place actual credentials or secret values in the policy; use names/patterns describing protected implementation details.

## Usage
```bash
python scripts/refusal_leak_scanner.py refusal.txt --policy config/policy.json
python -m unittest discover tests -v
```
Exit 0 means no configured deterministic finding; exit 4 means block; exit 2 means invalid input/config. A clean scan is not proof of safety: run the multi-turn audit workflow too.

## Workflow
Follow `workflows/audit-and-harden.md`: Observe → Measure baseline → Diagnose → Hypothesize → Improve → Measure again → Independent verification. Remediation loops are capped at three.

## Metrics
Known-sensitive leaks, pattern findings, cumulative reconnaissance gain, benign explanation quality, false positives, denial timing/status variance.

## Verification
**Implemented:** deterministic scanner, tests, rules, workflow, hook, and reviewer contract exist in this package.

**Measured:** consumers must capture their product-specific baseline before claiming improvement.

**Verified:** only after the exact failing corpus plus neighboring variants pass and an independent reviewer verifies high-severity fixes.

## Safety
Use synthetic test data and non-production accounts. Do not use this package to discover real secrets or bypass controls. Do not ask for hidden chain-of-thought. Never weaken authentication, authorization, or user-facing safety policy merely to homogenize refusal behavior.

## Failure handling
Detection evidence is retained. Remediation is limited to three changed hypotheses. Persistent high-severity leakage blocks release; lower-severity exceptions require explicit security-owner acceptance.

## Definition of Done
Research documented; baseline captured; root cause identified; configured leak removed or formally accepted; deterministic and adaptive tests pass; independent verification completed for high severity; no secrets exposed; no blocking issue remains.

## Customization
Extend the sensitive inventory, product-specific multi-turn corpus, metadata capture, and severity policy. Keep deterministic rules separate from model-based judgments so failures remain auditable.
