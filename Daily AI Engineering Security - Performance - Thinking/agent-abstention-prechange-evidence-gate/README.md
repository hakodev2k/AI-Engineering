# Agent Abstention Pre-Change Evidence Gate

**Category:** Thinking  
**Status:** Reusable reference package  
**Research date:** 2026-09-06 (Vietnam time, UTC+7)

## Topic
A pre-write control plane for coding agents that prevents unnecessary source changes when an issue is stale, already fixed, duplicate, environment-specific, or insufficiently evidenced, while avoiding naive over-abstention on partially fixed defects.

## Problem
Current coding agents are often implicitly rewarded for producing a patch. FixedBench shows that even strong agents modify already-correct repositories in 35%–65% of no-change tasks. A simple "reproduce first" instruction improves abstention but can incorrectly suppress necessary fixes when only part of a report has been resolved. The engineering problem is therefore action calibration, not just reproduction.

## Evidence
See `evidence/research.md` for observed public evidence, interpretation, existing approaches, limitations, root causes, and source links.

## Existing approach
Typical systems rely on prompt instructions, test-first behavior, planning modes, git inspection, or downstream human review.

## Existing limitations
Those mechanisms rarely create a blocking, machine-verifiable record that proves a repository write is necessary. They also tend to collapse partial-fix and environment-mismatch states into a binary reproduced/not-reproduced decision.

## Proposed improvement
Separate investigation from mutation. Before writes are enabled, require a structured evidence record with facts, assumptions, evidence, hypotheses, risks, partial-fix analysis, decision, and verification status. Run a deterministic gate. Treat `no-change` as a valid successful task result and `insufficient-evidence` as a blocked state rather than an invitation to guess.

## Architecture

```text
agent-abstention-prechange-evidence-gate/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── prewrite-evidence-gate.md
├── rules/
│   └── action-calibration.md
├── scripts/
│   └── decision_gate.py
├── skills/
│   └── prechange-investigation.md
├── subagents/
│   └── change-necessity-reviewer.md
├── tests/
│   └── test_decision_gate.py
└── workflows/
    └── triage-before-edit.md
```

## Installation
Requires Python 3.9+ only for the deterministic gate. Documentation files are framework-neutral and can be adapted to any coding-agent harness.

## Configuration
Create a decision JSON object containing:

- `decision`: `change-required`, `no-change`, or `insufficient-evidence`
- `facts`: observed current-state facts
- `assumptions`: explicit assumptions
- `evidence`: at least two independent evidence items for a conclusive decision
- `hypotheses`: competing explanations considered
- `risks`: relevant risks
- `verification_status`: `reviewed` or `verified` for a conclusive decision
- `partial_fix_checked`: boolean
- optional `contradictions`: unresolved contradictory evidence

## Usage
Run the investigation procedure before source mutation. Then validate the decision record:

```bash
python scripts/decision_gate.py decision.json
```

Exit codes:
- `0`: `change-required`, write phase may begin.
- `2`: malformed record.
- `3`: insufficient evidence.
- `4`: `no-change`; task may proceed to no-change verification, but writes remain blocked.
- `5`: unresolved contradiction or unverified decision.

Run reference tests with:

```bash
python -m pytest tests/test_decision_gate.py
```

## Workflow
Follow `workflows/triage-before-edit.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Gate → Independent review when required → Implement only if justified → Measure again → Verify.

## Metrics
Track false-change rate on known no-change tasks, false-abstention rate on partially fixed tasks, percentage of writes with valid decision records, reviewer disagreement, regressions introduced, and time to justified decision.

## Verification
A `change-required` result is not completion. After implementation, rerun the original acceptance/reproduction evidence and relevant regression tests. A `no-change` result must still be independently reviewable from current-state evidence. Do not claim verified status from the gate alone.

## Safety
The package never grants write permission by itself. It only returns whether the evidence contract permits a write phase. High-risk changes require independent review. Tests and evidence MUST NOT be weakened to force a preferred decision.

## Failure handling
Detection: malformed evidence, missing corroboration, unresolved contradictions, or failure to distinguish partial fixes. Evidence: preserve the decision record, commands, outputs, and repository identity. Retry: maximum three diagnosis rounds and at most one targeted independent-review feedback round. Fallback: remain read-only. Escalation: require human direction when evidence remains insufficient. Stop condition: do not mutate tracked source while the decision is unresolved.

## Definition of Done
- **Implemented:** the evidence gate and integration policy are present and executable.
- **Measured:** a baseline decision record and post-decision metrics are captured.
- **Verified:** the decision is independently reproducible; if a patch was made, acceptance and regression checks pass; if no patch was made, evidence demonstrates current behavior already satisfies the request.

No completion is valid while a blocking contradiction remains.

## Customization
Teams may add repository-specific required evidence classes, risk tiers, approval requirements, or environment checks. Preserve the three-way decision model and the invariant that uncertainty blocks writes rather than silently converting to action.
