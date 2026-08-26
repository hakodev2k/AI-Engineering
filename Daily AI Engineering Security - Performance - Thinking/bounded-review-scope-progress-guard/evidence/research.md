# Research — Bounded Review Scope Progress Guard

**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Multi-agent engineering workflows that repeatedly convert reviewer findings, governance work, or continuation signals into new blocking work without measurable production progress.

## Problem
A coordinator can treat every reviewer concern as authorization to expand scope, continually revise plans/tests, or keep running even when findings are outside the approved objective. A related failure mode is automatic continuation that produces activity but no state-changing progress. These loops consume time/tokens and can make completion criteria move indefinitely.

## Why it matters now
OpenAI Codex issue #38375 (opened 2026-08-13) reports an orchestrator repeatedly turning out-of-scope reviewer findings into blocking implementation cycles despite explicit scope-change rules. Issue #37600 (opened 2026-08-08) reports Goal/subagent workflows spending hours expanding process scaffolding without proportional production implementation. Issue #37800 (opened 2026-08-10) reports an automatic continuation loop consuming tokens while emitting repeated continuation text without meaningful progress.

## Affected users
Developers using coding agents, multi-agent orchestrators, teams using automated code review/verification, and platform builders implementing long-running autonomous workflows.

## Current public evidence

### Observed evidence
1. Codex issue #38375: broad adversarial reviewers produced plausible but out-of-scope findings; the root orchestrator repeatedly amended the active plan, created new tests and implementation slices, and continued until review passed rather than validating findings against the approved requirement and deployment assumptions.  
   https://github.com/openai/codex/issues/38375
2. Codex issue #37600: a long-running Goal/subagent workflow reportedly spent several hours growing process/governance scaffolding without proportional production progress.  
   https://github.com/openai/codex/issues/37600
3. Codex issue #37800: an automatic continuation loop repeatedly emitted continuation output without edits or meaningful progress, consuming tokens.  
   https://github.com/openai/codex/issues/37800

### Interpretation
The shared engineering defect is missing control-state invariants: reviewers can discover problems but should not redefine authority; continuation should require a measurable state transition; loops need bounded retries and explicit stop/escalation conditions.

## Existing approaches
- Prompt instructions telling agents not to expand scope.
- Separate executor/reviewer roles.
- Acceptance criteria and implementation plans.
- Max-iteration or token limits.
- Human review after agent output.

## Remaining limitations
- Natural-language scope rules are easy to reinterpret during long runs.
- Severity labels can be mistaken for product authorization.
- Reviewers may generate valid concerns that are not caused by the reviewed change.
- Generic iteration caps stop waste but do not distinguish legitimate rework from scope drift.
- Activity counters do not prove production progress.

## Root-cause analysis
1. No machine-checkable mapping from blocking findings to approved requirements.
2. Reviewer authority is not separated from owner authority.
3. Progress is measured as messages/tool calls rather than accepted state changes.
4. The orchestrator lacks a stable scope ledger and explicit progress checkpoint.
5. Retry/continuation conditions are open-ended or based on subjective "review passes".

## Improvement opportunity
Introduce a deterministic gate requiring a blocking finding to satisfy all of: maps to an approved requirement, exists in or is caused by the reviewed diff, is reproducible under stated assumptions, and has evidence. Track production progress as accepted artifacts/tests/state changes rather than agent activity. Bound review cycles and route legitimate out-of-scope findings to a deferred ledger requiring owner approval.

## Relevant sources
- Codex #38375: https://github.com/openai/codex/issues/38375
- Codex #37600: https://github.com/openai/codex/issues/37600
- Codex #37800: https://github.com/openai/codex/issues/37800
