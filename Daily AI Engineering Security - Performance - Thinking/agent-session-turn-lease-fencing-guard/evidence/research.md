# Research: Agent Session Turn Lease Fencing Guard

## Topic
Agent session turn lease fencing for concurrent AI runtimes.

## Category
Thinking

## Problem
Stateful agent runtimes can permit two mutation-capable turns to execute against the same logical conversation or session when ownership changes, a client times out while server work continues, a background delegation wakes the session, or another UI resumes the same thread. The resulting interleaving can corrupt state, duplicate tool work, mis-associate results, or make a session appear stopped while execution is still active.

## Why it matters now
This is a live 2026 failure mode across multiple agent runtimes, not a hypothetical distributed-systems concern. Recent reports show concurrent turns caused by ownership races, missing per-session locks, timeout/retry behavior, and async-delivery lifecycle gaps.

## Affected users
- developers using coding agents from multiple windows or clients
- teams running async subagents or background delegation
- platform engineers implementing resumable or remote agent sessions
- operators relying on session transcripts as authoritative state

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #38629, opened 2026-08-14, reports that opening an active conversation in another VS Code window can transfer ownership while the original app-server turn remains active. A second prompt then starts another turn in the same conversation, producing interleaved rollout records. Source: https://github.com/openai/codex/issues/38629
2. NousResearch Hermes Agent issue #100689, opened 2026-09-01, reports async-delegation wake delivery using a 600-second client timeout while the server-side turn continues. A retry can then post another wake into the same session; the report states the API server has no per-session lock and describes duplicate concurrent turns, delayed results, and dropped results. Source: https://github.com/NousResearch/hermes-agent/issues/100689
3. Hermes Agent issue #79080, opened 2026-08-05, requests an explicit collect/ack lifecycle because durable async completion can arrive after a parent already consumed a result and finished, producing duplicate post-final delivery. Source: https://github.com/NousResearch/hermes-agent/issues/79080
4. OpenWork issue #3814, opened 2026-08-15, reports an exactly-once violation in browser tooling where one logical operation can execute dozens to hundreds of times and duplicate transcript events/responses. Source: https://github.com/different-ai/openwork/issues/3814

## Existing approaches
Current runtimes use combinations of UI owner/follower roles, session IDs, client-side timeouts, retry loops, completion queues, transcript state, and asynchronous delivery handles. Some issue proposals add explicit collect/ack semantics or improve routing. These are useful mechanisms, but they do not by themselves establish a universal invariant that only the current lease holder may mutate a session.

## Remaining limitations
- UI ownership can diverge from still-running server execution.
- A client timeout does not prove server cancellation.
- Retry logic can create a second logical turn unless it is fenced by an idempotency/lease epoch.
- A session identifier alone does not prevent a stale owner from writing.
- Delivery acknowledgement and turn ownership are often separate concerns.
- Transcript status can lag behind actual process state.

## Root-cause analysis
### Interpretation
The common root cause is missing or incomplete single-writer semantics at the mutation boundary. Coordination is frequently represented as UI state or request lifecycle state rather than a server-enforced lease with a monotonically increasing fencing token. When ownership changes, stale workers retain authority because writes are not rejected based on lease generation. When retries occur after uncertain completion, the new request lacks a durable operation identity tied to the same lease.

Contributing causes include asynchronous ownership discovery, cancellation ambiguity, background delivery paths that bypass foreground coordination, and absence of a reconciliation step before a new owner proceeds.

## Improvement opportunity
### Proposed solution
Introduce a reusable turn-lease contract with four observable controls:
1. exactly one active mutation lease per session;
2. a monotonically increasing fencing epoch on each ownership grant;
3. every mutation/tool-result append must present the current epoch and a unique operation ID;
4. uncertain completion must reconcile server state before retrying or granting a new mutation lease.

A deterministic guard can validate event streams and fail when overlapping leases, stale fenced writes, duplicate operation IDs, or mutation-without-lease events are observed. This improves reasoning reliability without requesting hidden chain-of-thought.

## Goal
Prevent concurrent mutation-capable turns and stale-owner writes while preserving safe read-only followers and resumability.

## Metrics
- concurrent mutation lease violations per 1,000 sessions
- stale-epoch mutation attempts blocked
- duplicate operation IDs blocked
- ambiguous timeout recoveries reconciled before retry
- session recovery time
- false-positive rate for legitimate read-only followers

## Trigger
Use when a runtime supports any of: multiple clients, resume/handoff, async subagents, background wake delivery, retries after timeout, or remote app-server workers.

## Inputs
Lease events, session ID, actor/worker ID, epoch, operation ID, mutation/read-only classification, timestamps, and optional terminal/reconciliation evidence.

## Outputs
Allow/block decision, violation evidence, reconciliation requirement, and verification report.

## Relevant sources
- https://github.com/openai/codex/issues/38629
- https://github.com/NousResearch/hermes-agent/issues/100689
- https://github.com/NousResearch/hermes-agent/issues/79080
- https://github.com/different-ai/openwork/issues/3814

## Evidence status
Implemented package logic is separate from observed evidence. No claim is made that the proposed lease design is already deployed by the projects above. Verification requires running this package against local fixtures or runtime event exports.