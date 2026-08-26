# Agent Convergence Progress Circuit Breaker

**Category:** Thinking

## Problem
Long-running coding agents can keep consuming turns, tools and tokens without reducing the actual acceptance gap. Repeated continuation text, review cycles, task expansion and stale polling can look active while production progress is zero.

## Evidence
`evidence/research.md` documents current August 2026 Codex reports of automatic continuation loops, multi-day task expansion, five-hour zero-fix runs and a 16.5-hour unattended multi-billion-token session.

## Existing approach
Prompt instructions to continue, manual interruption, wall-clock/token ceilings, reviewer subagents and model-generated task lists.

## Existing limitations
Prompt-only stop rules are non-deterministic; resource ceilings cannot distinguish slow progress from zero progress; reviewers can create work recursively; tool activity can be mistaken for progress.

## Proposed improvement
A deterministic convergence ledger and post-turn circuit breaker based on observable acceptance, artifact and evidence deltas. It neither requests nor stores hidden chain-of-thought.

## Architecture
```text
agent-convergence-progress-circuit-breaker/
├── README.md
├── evidence/research.md
├── config/policy.json
├── skills/convergence-analysis.md
├── rules/convergence-contract.md
├── subagents/convergence-verifier.md
├── workflows/execute-converge-verify.md
├── hooks/post-turn-convergence.md
├── scripts/convergence_guard.py
└── tests/test_convergence_guard.py
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
`config/policy.json` sets no-progress, work-expansion and review-retry budgets. Tighten or relax only with measured task telemetry; never disable required security/verification gates to improve apparent convergence.

## Usage
Append one JSON object per autonomous cycle. Required fields: `acceptance_open`, `artifact_fingerprint`, `evidence_count`, `new_work_items`, `finalizing`. New work must include `new_work_acceptance_row` when policy requires ownership.

Run:
```bash
python scripts/convergence_guard.py --ledger task-ledger.jsonl --policy config/policy.json
python -m unittest tests/test_convergence_guard.py
```

Exit 0 = pass; exit 2 = invalid input; exit 3 = convergence violation.

## Workflow
Observe → baseline acceptance state → diagnose highest-priority open row → form observable hypothesis → implement bounded change → measure again → bounded recovery if needed → independent verification → complete or explicit blocked state.

## Metrics
Acceptance rows closed per turn, max no-progress streak, new-work-to-closure ratio, repeated verification count, model/tool calls per closed row and rework rate.

## Verification
The Convergence Verifier must independently map every closed required acceptance row to concrete artifacts, tests or external evidence. Passing prose from the implementing agent is insufficient.

## Safety
The circuit breaker reduces wasted execution without weakening security, correctness or approval boundaries. Dangerous or irreversible actions still require explicit human approval.

## Failure handling
Detection: guard exit 3. Evidence: durable ledger plus artifact/test state. Retry: at most two recovery hypotheses for a blocker. Fallback: checkpoint and stop automatic continuation. Escalation: exact blocking acceptance row. Stop: exhausted retries, missing authority or irreversible-risk boundary.

## Definition of Done
- **Implemented:** acceptance ledger, policy, post-turn hook and guard integrated.
- **Measured:** progress and expansion metrics collected for the task.
- **Verified:** tests pass, required acceptance rows are evidence-backed, no unbounded retry remains, independent verifier passes.

## Customization
Integrations may derive artifact fingerprints from Git tree SHAs, build manifests or deployment IDs and evidence counts from test/verification artifacts. Preserve the invariant that observable state—not hidden reasoning—determines continuation.
