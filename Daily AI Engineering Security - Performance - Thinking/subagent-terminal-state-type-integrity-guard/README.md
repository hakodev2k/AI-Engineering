# Subagent Terminal-State Type Integrity Guard

**Category:** Thinking

## Problem
Multi-agent runtimes can report a child as `success` or `completed` even when its machine-readable terminal evidence says it was deferred, interrupted by a usage/turn limit, ended without a final deliverable, or still has live child work. A parent that trusts the coarse success label can skip work, repeat expensive investigation, or make decisions from partial output.

## Evidence
See `evidence/research.md`. Current reports span Claude Code and Gemini CLI and show several distinct ways a non-success terminal condition is collapsed into success metadata.

## Existing approach and limitation
Runtimes commonly expose status labels, retry on explicit errors, ask subagents to return a final message, and let parents inspect output. Prompt instructions and a single `completed` bit are insufficient when terminal reason, tool-result completeness, deliverable presence, or live-child state contradict that bit.

## Proposed improvement
Use a typed terminal contract at the orchestrator boundary. A child may be promoted to parent-visible `success` only when terminal state is `completed`, no non-success terminal reason exists, required final-result evidence is present, no tool call is left unresolved, no live descendants remain, and generation/task identity matches the current dispatch. Contradictions become `incomplete` or `failed`, never success.

## Architecture
```text
subagent-terminal-state-type-integrity-guard/
├── README.md
├── evidence/research.md
├── hooks/pre-parent-completion-gate.md
├── rules/success-classification-contract.md
├── schemas/subagent-terminal-event.schema.json
├── scripts/subagent_status_guard.py
├── skills/terminal-state-audit.md
├── subagents/completion-verifier.md
├── tests/test_subagent_status_guard.py
└── workflows/diagnose-and-gate.md
```

## Installation
Python 3.10+, standard library only.

## Usage
Normalize child terminal records to JSONL, then run:
```bash
python scripts/subagent_status_guard.py terminal-events.jsonl --json terminal-report.json
```
Exit `0`: classifications are internally consistent. Exit `2`: one or more success claims are unsupported. Exit `3`: invalid input/runtime failure.

## Configuration
The reference contract is intentionally strict. Hosts can add vendor-specific states to adapters, but MUST map nonterminal/deferred/limit/cancelled/failed states to something other than `success`.

## Workflow
Follow `workflows/diagnose-and-gate.md`: observe raw lifecycle evidence, establish a baseline, diagnose contradictory fields, correct adapter/orchestrator classification, measure again, then require independent verification.

## Metrics
- unsupported success claims per 1,000 child runs
- completed-without-deliverable rate
- unresolved-tool-at-success rate
- live-descendant-at-success rate
- re-dispatches caused by false completion
- verification coverage of child completions

## Verification
Run `python -m unittest tests/test_subagent_status_guard.py`. Fixtures cover valid completion, `tool_deferred`, missing deliverable, limit termination, unresolved tool calls, live descendants, and stale dispatch generation.

## Safety
The guard does not expose or request hidden chain-of-thought. It evaluates observable lifecycle fields and deliverable evidence. It does not automatically rerun expensive or state-changing work; retry requires bounded policy and, for dangerous actions, human approval.

## Failure handling
Malformed lifecycle data blocks success promotion. Reconciliation can be attempted twice. If raw sources disagree after two attempts, classify the child as `incomplete` and escalate rather than inventing success.

## Definition of Done
**Implemented:** schema, validator, rule, hook, workflow, reviewer and tests exist. **Measured:** baseline and post-change unsupported-success metrics are captured. **Verified:** tests pass and an independent reviewer confirms that no contradictory child record can promote the parent to completion.