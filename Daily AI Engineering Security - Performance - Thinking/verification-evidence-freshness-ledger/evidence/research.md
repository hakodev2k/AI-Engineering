# Research — Verification Evidence Freshness Ledger

## Topic
Prevent stale verification state, duplicate verification loops, and unsupported “verified” claims in coding-agent workflows.

## Category
Thinking

## Problem
Agent runtimes often lack a precise contract for when verification evidence becomes fresh, stale, or superseded. This can create two opposite failures: repeated verification despite a fresh pass, and acceptance of a completion claim backed by evidence from the wrong code revision.

## Why it matters now
Current coding-agent systems increasingly run long autonomous edit/test loops. Verification is becoming an explicit runtime gate, so evidence identity and freshness now directly affect cost, latency, and trust.

## Affected users
Developers using coding agents; CI/platform teams; agent-runtime maintainers; reviewers of autonomous code changes.

## Current public evidence

### Observed evidence
1. **Hermes Agent issue #80274**, opened August 6, 2026, reports a “verification status stale” loop in which the runtime kept citing an old output reference after newer green verification runs; one session reportedly ran the test suite 38 times. The issue also describes committed files being treated as still-unverified edits.  
   https://github.com/NousResearch/hermes-agent/issues/80274
2. **Hermes Agent issue #89182**, opened August 18, 2026, proposes extending passive verification evidence into a gate that blocks unsupported “done/tests passed/verified” claims unless there is fresh passing evidence, and notes that the current ledger is passive rather than completion-blocking.  
   https://github.com/NousResearch/hermes-agent/issues/89182
3. **aga-verify-agent** publicly documents a related revision-binding rule: passing tests from commit A do not prove commit B, so evidence must correspond to the exact code version under review.  
   https://github.com/agakadela/aga-verify-agent
4. **agent-loop 0.9.0 changelog** describes a task-closing gate that requires a concrete `verification-result.json` when an edit bundle exists, with explicit accepted-risk records rather than silently bypassing missing verification.  
   https://github.com/voku/agent-loop/blob/main/CHANGELOG.md

### Interpretation
The shared engineering problem is not “agents need more testing.” It is that verification state lacks a stable identity across revision, command, result, and time. Without that identity, orchestration cannot distinguish a necessary rerun from a duplicate rerun, and reviewers cannot reliably prove which code state was tested.

## Existing approaches
Verify-on-stop prompts; passive evidence ledgers; explicit verification result files; human review; commit-aware task verification; CI status checks.

## Remaining limitations
Prompt-level nudges can loop when stale state is injected repeatedly. Passive ledgers do not necessarily block unsupported completion. A bare “tests passed” record is ambiguous without revision and command identity. CI statuses may be fresh for a branch but stale for a later local edit. Human reviewers can miss revision drift.

## Root-cause analysis
1. Verification evidence is not bound to an immutable revision identifier.
2. “Latest output” pointers are mutable or not advanced atomically.
3. Completion gating and evidence recording are separate mechanisms.
4. Duplicate retry suppression lacks a stable evidence key.
5. Freshness is inferred from conversation state instead of explicit timestamps and revision checks.

## Improvement opportunity
Create an append-only evidence record with revision, command, result, timestamp and evidence ID. The completion gate selects the newest record for the exact current revision, enforces a freshness window, rejects failures, and returns a stable evidence key that can suppress duplicate reruns while the revision is unchanged.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/80274
- https://github.com/NousResearch/hermes-agent/issues/89182
- https://github.com/agakadela/aga-verify-agent
- https://github.com/voku/agent-loop/blob/main/CHANGELOG.md
