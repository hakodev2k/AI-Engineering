# Evidence Gain Convergence Watchdog

**Category:** Thinking

## Problem
Long-running coding agents can consume large time/token budgets while repeatedly investigating, revalidating, reopening settled decisions, and narrating progress without moving the terminal objective. This creates non-convergent loops even when individual tool calls are valid.

## Evidence
See `evidence/research.md`. Current public evidence includes Codex #39512 (>5× elapsed-time inflation, zero original bugs fixed, repeated low-value probes) and #36664 (74 compactions with 95% quickly followed by re-reading/rerunning prior work).

## Existing approach
Natural-language plans, generic turn/token limits, compaction, and human intervention exist, but they do not require each tool call to produce a measurable evidence delta against a named unresolved uncertainty.

## Proposed improvement
Persist a terminal-goal and evidence ledger; measure evidence gain for significant actions; detect semantically repeated no-gain probes; bind progress language to observable phase state; and trigger bounded replan/stop conditions before resource use becomes disproportionate.

## Architecture
```text
README.md
evidence/research.md
skills/convergence-analysis.md
rules/convergence-rules.md
subagents/convergence-verifier.md
workflows/evidence-driven-execution.md
hooks/post-action-convergence-check.md
scripts/convergence_watchdog.py
```

## Installation
Requires Python 3.9+. Integrate the post-action hook into the agent orchestrator and persist a structured `convergence-ledger.json` outside ephemeral model context so it survives compaction.

## Configuration
Set task-specific baseline minutes and soft/hard elapsed ratios. The defaults in examples are advisory; teams should calibrate from historical tasks. Configure normalized action signatures and phase names for the workflow.

## Usage
`python3 scripts/convergence_watchdog.py convergence-ledger.json --soft-ratio 2 --hard-ratio 5`

Exit 0 means no hard convergence violation; warnings indicate REPLAN. Exit 2 means malformed evidence. Exit 3 blocks the current branch because a hard limit or repeated no-gain sequence was detected.

## Workflow
Use `workflows/evidence-driven-execution.md`: Observe → choose uncertainty → hypothesize decisive evidence → execute → record evidence delta → continue or bounded replan → independently verify → complete.

## Metrics
Material evidence gain/tool call, duplicate no-gain ratio, elapsed/baseline ratio, token-to-evidence ratio, time-to-first-useful-change, phase completion rate, settled-decision reopen count, unsupported progress claims.

## Verification
The independent `subagents/convergence-verifier.md` checks ledger entries against tool state. Completion requires evidence for terminal phases or one precise external blocker; narration is never sufficient.

## Safety
The watchdog MUST NOT force unsafe changes merely to improve metrics. Security, approval, and verification requirements remain controlling constraints. It records observable facts and evidence only; it never requests hidden chain-of-thought.

## Failure handling
Detection: watchdog warning/error or independent verifier BLOCK. Retry: one transient tool retry; maximum two replans for one blocker. Fallback: checkpoint state and surface the exact blocker. Stop after three no-gain actions in a phase, two failed replans for one blocker, hard resource budget, or verified external blocker.

## Implemented / Measured / Verified
Implemented = ledger, hook, and watchdog are integrated. Measured = baseline/resource/evidence metrics are collected. Verified = bounded-loop checks pass and independent review confirms claims match tool evidence.

## Definition of Done
Evidence documented; baseline captured; terminal objective and settled decisions persisted; every significant action has evidence delta; loops are bounded; resource metrics collected; progress claims match phase state; original objective is verified or a precise external blocker is proven; no unsupported conclusion remains.

## Customization
Teams may add token-cost budgets, semantic command normalization, CI phase adapters, or deployment-state validators. Preserve bounded retries, evidence-linked state, and independent verification.