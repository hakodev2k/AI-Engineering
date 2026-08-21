# Agent Ground-Truth Completion Gate

**Category:** Thinking

## Problem
Coding agents can produce confident success summaries that are stronger than the observed execution evidence: commands may never have run, targeted tests may not cover changed code, or verification may be stale after later edits.

## Evidence
See `evidence/research.md` for current public reports from Claude Code and Goose describing unsupported "done/verified/tests passed" claims and requests for evidence-grounded completion checks.

## Existing approach and limitation
Prompting agents to verify, self-review, or relying on later CI is probabilistic or delayed. Raw tool logs are not automatically mapped to the claims users are asked to trust.

## Proposed improvement
Maintain a structured claim/evidence ledger and run a deterministic completion gate before final success language. Evidence must be executed, relevant, passing, and fresh. High-impact work receives independent verification.

## Actual package tree
- `README.md`
- `evidence/research.md`
- `config/completion-policy.json`
- `scripts/completion_gate.py`
- `skills/evidence-grounded-verification.md`
- `rules/completion-claim-policy.md`
- `subagents/independent-verifier.md`
- `workflows/verify-before-complete.md`
- `hooks/pre-completion-gate.md`
- `tests/test_completion_gate.py`

## Installation
Python 3.9+ is sufficient for the gate. Install `pytest` to execute the regression suite.

## Configuration
`config/completion-policy.json` maps claim types to required evidence types. Extend it with repository-specific claims rather than weakening existing requirements.

## Usage
Create a ledger containing intended `claims` and `evidence`, then run:

`python3 scripts/completion_gate.py ledger.json --policy config/completion-policy.json`

Exit 0 means the requested claims are supported by the supplied fresh evidence; exit 4 blocks unsupported claims; exit 2 indicates invalid input/configuration.

## Workflow
Observe → baseline → define acceptance evidence → implement → execute targeted/canonical checks → invalidate stale evidence → run claim gate → independent verification when required. The same hypothesis may be retried at most twice before re-diagnosis.

## Metrics
Claim support rate, acceptance-criteria evidence coverage, stale evidence count, unsupported high-confidence claim count, canonical verification pass rate, and post-completion rework.

## Verification
Run `pytest tests/test_completion_gate.py`. Repository integration must also prove that actual tool-event records populate the ledger, edits invalidate relevant evidence, and the final-response path cannot bypass an equivalent blocked claim through wording changes.

## Safety
The package requests observable evidence only; it must not request or persist hidden chain-of-thought. Sensitive command output should be redacted before ledger persistence.

## Failure handling
Detection: gate exit 4/2, contradictory tool result, stale verification, or uncovered acceptance criterion. Evidence: command/result/scope/freshness and repository state. Retry: maximum two attempts for the same hypothesis. Fallback: downgrade status to Implemented/Measured/Incomplete and list missing verification. Escalation: human/reviewer when authoritative verification is unavailable or ambiguous. Stop: exhausted retries, unresolved acceptance criteria, or canonical checks cannot be executed safely.

## Definition of Done
**Implemented:** the change exists and is recorded. **Measured:** relevant checks/metrics were actually executed and captured. **Verified:** acceptance criteria are covered by fresh authoritative evidence, canonical verification passes, independent review is complete when required, and the completion gate supports every high-confidence claim.

## Customization
Register repository-specific canonical build/test evidence and high-impact criteria. Add claim types only when their evidence requirements are objectively testable.