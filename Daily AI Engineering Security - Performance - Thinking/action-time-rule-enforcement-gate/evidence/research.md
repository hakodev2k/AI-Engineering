# Research — Action-Time Rule Enforcement Gate

## Topic
Critical project/memory rules can be present in context yet fail to influence the exact action they are meant to govern.

## Category
Thinking

## Problem
Agent systems commonly load project instructions and persistent memory at session start, then rely on model recall while execution context fills with code, tool outputs, notifications, and intermediate decisions. Procedural rules such as “build before a long run”, “never commit without permission”, or “verify before mutation” can therefore be acknowledged yet skipped at action time. Stronger wording alone does not make the rule observable or enforceable.

## Why it matters now
Long-running coding-agent sessions and background orchestration are increasingly common. The longer the session and the larger the immediate context, the more costly a missed precondition can become: invalid benchmarks, stale builds, unwanted mutations, or hours of compute discarded.

## Affected users
Developers using CLAUDE.md/project rules, persistent agent memory, repository instructions, long-running coding sessions, CI/benchmark agents, and platform builders exposing tool-use hooks.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #84265, opened 2026-08-05 and open when researched on 2026-08-19, reports three violations of the same documented memory rule in one ~24-hour session: a stale build was used before a multi-hour job, a declared launcher was bypassed, and a run parameter was silently dropped. The rule was present in context; the reporter argues that nothing forced re-consultation at the moment of action. Source: https://github.com/anthropics/claude-code/issues/84265
2. Claude Code issue #80579, opened 2026-07-23 and still open, consolidates fresh and historical reports where CLAUDE.md rules are loaded and can be quoted but are ignored during execution. It specifically notes that stricter words such as `STRICT`, `CRITICAL`, and `NEVER` have not solved the pattern and proposes structural gating/per-tool rule consultation. Source: https://github.com/anthropics/claude-code/issues/80579
3. Claude Code issue #81988 reports long-context degradation where CLAUDE.md working rules stop being followed without a user-visible transition; the user workaround is to explicitly re-read CLAUDE.md or hand off to a fresh session. Source: https://github.com/anthropics/claude-code/issues/81988

### Interpretation
The problem is not simply “the model forgot”. Declarative instructions and action control are separate mechanisms. A rule can exist, be understood, and still fail because there is no deterministic checkpoint binding the rule to a concrete action class. This package therefore focuses on observable preconditions rather than hidden reasoning or chain-of-thought.

### Proposed solution
Compile critical procedural rules into a compact action-time gate registry. Each gate declares action matchers, required evidence, blocking conditions, freshness, retry limits, and human-approval requirements. Before a high-cost, irreversible, or rule-governed action, a deterministic checker selects matching gates and validates supplied evidence. Missing/stale evidence blocks the action and returns explicit requirements. Soft preferences remain outside the blocking registry.

## Existing approaches
- Session-start CLAUDE.md/instruction loading.
- Persistent memory files.
- Strong imperative wording (`MUST`, `NEVER`, `CRITICAL`).
- Model self-review and user correction after violation.
- Generic PreToolUse hooks without a structured rule/evidence contract.

## Remaining limitations
- Natural-language matching can over-trigger or miss relevant rules.
- Not every rule is deterministic; some need human review.
- Re-reading full instruction files before every tool call wastes tokens.
- Stale evidence can satisfy a superficial checklist unless freshness is explicit.
- A gate must not request or expose hidden chain-of-thought.

## Root-cause analysis
1. Rule loading is decoupled from action execution.
2. Critical and preference-level instructions often share the same representation.
3. Long context dilutes procedural relevance.
4. Evidence freshness is rarely modeled.
5. Post-hoc correction does not prevent expensive/irreversible mistakes.

## Improvement opportunity
Use a small machine-readable registry containing only blocking procedural invariants, then require structured evidence at matched action boundaries. This keeps token cost low and allows deterministic verification without asking for private reasoning.

## Goal
Reduce rule-governed actions executed without required fresh evidence, while keeping false blocks and context overhead measurable.

## Metrics
- governed actions with gate evaluation coverage;
- blocked missing-precondition actions;
- rule violations escaping the gate;
- stale-evidence rejection rate;
- false-positive block rate;
- added latency/tokens per governed action;
- rework/invalid-run rate before versus after adoption.

## Trigger
Before high-cost runs, commits/pushes, destructive mutations, deployments, benchmarks, direct tool bypasses, or any action matched by a registered hard rule.

## Inputs
Action type/metadata, rule registry, evidence records, timestamps, approval state, and optional repository/session epoch.

## Outputs
`allow`, `block`, or `review` plus applicable gate IDs, missing/stale evidence, and bounded recovery instructions.

## Status
**Implemented:** gate registry example, deterministic checker, rules, workflow, hook, tests, verification subagent.

**Measured:** after an adopter records baseline rule violations and gate telemetry.

**Verified:** only when replay tests show governed violations are blocked without unacceptable false positives and no required correctness/security context is dropped.
