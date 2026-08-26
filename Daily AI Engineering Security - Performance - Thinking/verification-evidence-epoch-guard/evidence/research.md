# Research — Verification Evidence Epoch Guard

**Topic:** Verification freshness loops in coding agents  
**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Coding agents can repeatedly re-run already-successful verification because the runtime tracks stale timestamps, historical changed paths, or temporary verification harnesses instead of binding a passing result to the exact code snapshot it verified.

## Why it matters now
Recent Hermes Agent issues document 38 consecutive redundant verification runs and repeated re-flagging after a documented temporary verification harness passed. The failures burn time/tokens and can prevent convergence despite green tests.

## Affected users
Developers using long-running coding agents, autonomous repair loops, CI-aware agents, and teams relying on fresh-verification gates.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #80274, opened 2026-08-06, reports a stale verification prompt continuing after fresh green runs because the last-output reference never advances and committed files remain classified as unverified. One session ran verification 38 times. https://github.com/NousResearch/hermes-agent/issues/80274
2. Hermes Agent issue #84304, opened 2026-08-12, reports that a passing ad-hoc verification harness is re-flagged after the temporary harness is cleaned up, causing 2–3 redundant identical reruns. https://github.com/NousResearch/hermes-agent/issues/84304
3. `backcheck` independently addresses the broader stale-green problem by checking whether source files changed after the last successful verification. https://github.com/VectorInstitute/backcheck
4. `proof-loop` uses durable proof artifacts and fresh verifier roles, showing an existing engineering pattern for evidence-backed completion. https://github.com/LeoStehlik/proof-loop

### Interpretation
The recurring defect is an evidence-identity problem: verification freshness is inferred from mutable runtime metadata instead of a monotonic verification event tied to an immutable workspace snapshot. A passing result should remain fresh until the verified snapshot changes or an explicit TTL/policy invalidates it.

## Existing approaches
Verification reminders, stop hooks, transcript evidence inspection, proof folders, independent verifier roles, and CI checks.

## Remaining limitations
- Timestamps alone do not identify what code was tested.
- Historical changed-path ledgers can confuse committed history with current dirty state.
- Temporary harness cleanup can erase the artifact runtime logic expects to see.
- Same-agent self-report can claim freshness without proving snapshot identity.
- Re-running blindly is expensive and can loop indefinitely.

## Root-cause analysis
1. No stable snapshot identifier is bound to a verification result.
2. Verification sequence numbers are not monotonic or are not persisted.
3. Dirty-state detection uses historical edits rather than current workspace state.
4. Verification evidence and completion claims are stored in different channels.
5. Retry policies lack a bounded stop condition when freshness state does not advance.

## Improvement opportunity
Use a deterministic verification epoch ledger: every successful verification records a monotonic epoch, exact snapshot identifier, exit code, timestamp, and dirty-diff capture state. Reverify only if the current snapshot differs, the epoch regresses, the result failed, policy TTL expires, or an uncaptured dirty diff exists.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/80274
- https://github.com/NousResearch/hermes-agent/issues/84304
- https://github.com/VectorInstitute/backcheck
- https://github.com/LeoStehlik/proof-loop
