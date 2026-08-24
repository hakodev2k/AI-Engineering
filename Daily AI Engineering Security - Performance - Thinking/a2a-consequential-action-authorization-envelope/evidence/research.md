# Research — A2A Consequential Action Authorization Envelope

## Topic
Exact-message/action authorization for consequential A2A operations.

## Category
Security

## Problem
An A2A server may authenticate a caller and authorize protocol access while still lacking portable proof that this caller authorized this exact side effect, exact parameters, intended receiver and purpose for a bounded period. Delegation, retries and shared bearer identities amplify the gap.

## Why it matters now
Recent A2A proposals and implementation reports in August 2026 independently converge on authorization provenance, exact side-effect intent and replay safety as unresolved engineering problems.

## Affected users
A2A client/server developers, multi-agent platform builders, operators of payment/deployment/account-change agents, teams using reverse proxies or delegated agents, and reviewers responsible for human approval boundaries.

## Current public evidence
### Observed evidence
1. The official A2A specification requires authentication/authorization on operations and discusses task/resource scoping and in-task authorization. These are necessary protocol controls, but they do not by themselves encode a portable one-use authorization for the exact semantic side effect and parameter set. https://github.com/a2aproject/A2A/blob/main/docs/specification.md
2. `a2aproject/A2A` issue #2133, opened 2026-08-13, proposes an authorization envelope answering which identified caller authorized an exact message, for which receiver/purpose, until when, and whether the authorization was consumed. https://github.com/a2aproject/A2A/issues/2133
3. `a2aproject/A2A` issue #2098, opened 2026-08-03, proposes IntentRail because the protocol lacks a portable way to express the exact side effect and limits, bind approval, prevent a retry/replay from causing a second execution, and connect outcome to authorization. https://github.com/a2aproject/A2A/issues/2098
4. `a2aproject/A2A` issue #1716, opened 2026-04-05, identifies authorization gaps at skill boundaries, reinforcing that broad agent/session authorization may not be granular enough for capability-specific actions. https://github.com/a2aproject/A2A/issues/1716
5. `NousResearch/hermes-agent` issue #80534, opened 2026-08-06, reports a deployment pattern where a shared bearer token behind a reverse proxy collapses distinct peers to one identity, weakening identity-bound policy decisions. https://github.com/NousResearch/hermes-agent/issues/80534

## Interpretation
The independent signals point to a trust-boundary distinction: transport identity, protocol permission and exact consequential-action authorization are different assertions. An implementation should preserve all three rather than treating one as a substitute for another.

## Existing approaches
- TLS/OAuth/bearer authentication and A2A security schemes;
- task/resource/skill authorization;
- human confirmation prompts;
- downstream idempotency keys;
- audit logs and task state;
- application-specific signed intents or approval records.

## Remaining limitations
- authentication does not bind exact parameters or semantic side effect;
- broad task/skill permission can outlive the intended one-off action;
- retries after lost responses can duplicate an already-successful side effect;
- approval may not be bound to receiver, purpose or changed message/parameter bytes;
- shared gateway credentials can erase caller identity provenance;
- audit evidence generated after execution cannot prevent an unauthorized action.

## Root-cause analysis
1. Identity, capability authorization and side-effect authorization are often represented by different layers with no common binding.
2. Natural-language intent is mutable and too ambiguous for deterministic replay protection.
3. Approval records are frequently session-scoped instead of content-scoped.
4. Side-effect success and authorization consumption may not be atomically reconciled.
5. Retry logic is often transport-oriented and unaware of semantic idempotency.

## Improvement opportunity
Introduce a compact deterministic envelope that binds caller, receiver, task/message digest, semantic action, parameter digest, purpose, expiry, nonce and one-use authorization ID. Verify immediately before execution. Pair the authorization ID with atomic consumption or a downstream idempotency key, and reconcile ambiguous outcomes before any retry.

## Proposed solution
This package provides an envelope schema, no-dependency verifier, enforceable rules, analysis skill, independent security reviewer, pre-action hook, bounded authorize/execute/reconcile workflow and regression tests.

## Goal
Make a consequential side effect executable only when exact authorization evidence matches the current action and has not expired or been consumed.

## Metrics
Envelope coverage, mismatch/expiry/replay blocks, blind retries, duplicate side effects, exact human-approval coverage and unresolved ambiguous outcomes.

## Trigger
Immediately before any consequential A2A action such as payment, deployment, credential/account mutation, destructive repository action or external write with material impact.

## Inputs
Authorization envelope, canonical current request, used-authorization ledger, trusted current time.

## Outputs
Deterministic verification result and evidence suitable for an execution gate.

## Relevant sources
- https://github.com/a2aproject/A2A/blob/main/docs/specification.md
- https://github.com/a2aproject/A2A/issues/2133
- https://github.com/a2aproject/A2A/issues/2098
- https://github.com/a2aproject/A2A/issues/1716
- https://github.com/NousResearch/hermes-agent/issues/80534
