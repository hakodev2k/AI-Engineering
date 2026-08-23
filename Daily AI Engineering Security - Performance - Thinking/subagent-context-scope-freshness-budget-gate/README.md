# Subagent Context Scope, Freshness & Budget Gate

**Category:** Token

## Problem
Subagents can receive context they did not opt into and, at the same time, receive stale copies of context that has changed since the parent session began. This wastes input tokens while creating a correctness hazard: more context is not necessarily the right context.

## Evidence
Fresh August 2026 Claude Code reports show auto-memory unexpectedly occupying 34% of a small subagent's initial payload despite no `memory` field, and subagents receiving CLAUDE.md/memory snapshots captured at parent-session start rather than at spawn time. See `evidence/research.md`.

## Existing approach and limitation
Hosts commonly inherit parent/project context implicitly. This is convenient, but inheritance is rarely governed by explicit per-agent scope, token budget, freshness metadata, or a refresh rule. Blind deduplication cannot solve stale content, and blind refresh can increase token cost.

## Proposed improvement
Treat every subagent context source as a scoped artifact with provenance, token cost, capture time, content hash, and opt-in policy. Before dispatch, enforce a budget and freshness gate: exclude undeclared optional memory, refresh required sources that changed, retain correctness-critical instructions, and record exactly what was sent.

## Package tree
- `evidence/research.md` — current public evidence and root cause.
- `skills/context-scope-audit.md` — context audit procedure.
- `rules/context-contract-rules.md` — enforceable child-context policy.
- `subagents/context-budget-reviewer.md` — independent verification role.
- `workflows/preflight-refresh-dispatch.md` — bounded dispatch workflow.
- `hooks/pre-subagent-context-gate.md` — deterministic pre-dispatch gate.
- `scripts/context_contract_audit.py` — no-dependency audit implementation.
- `tests/test_context_contract_audit.py` — executable tests.

## Installation
Python 3.10+; no external dependencies.

## Usage
`python scripts/context_contract_audit.py snapshot.json --budget-tokens 30000 --json`

Each source records `name`, `kind`, `tokens`, `required`, `opted_in`, `captured_at`, and optional `current_mtime`.

## Metrics
Input tokens/subagent; undeclared-memory tokens; stale-source count; context utilization; dispatch block rate; refresh tokens; task quality/regression rate; missing-critical-context incidents.

## Verification
Run `python -m unittest discover -s tests -p 'test_*.py'`. Production verification requires lower unnecessary tokens with no increase in missing-context failures and successful detection/refresh of changed required context.

## Safety
Budget reduction MUST NOT remove required security, user, repository, or task constraints. Freshness checks are read-only. A failed audit blocks optimized dispatch and falls back to a known-correct conservative context or human review.

## Failure handling
At most one refresh/re-audit cycle per dispatch. If required context still exceeds budget, escalate or route to a model/window that can safely carry it.

## Definition of Done
Baseline captured; context sources provenance-tagged; optional memory opt-in enforced; freshness metadata available; gate installed; tests pass; before/after token and quality metrics recorded; no critical context loss.