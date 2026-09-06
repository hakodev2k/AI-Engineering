# Skill: Failover State Analysis

## Purpose
Decide whether a degraded stateful agent run should retry, fail over, reconcile, or stop.

## Trigger
Provider timeout, 429/5xx burst, stream termination, missing terminal response, tool-result correlation error, or explicit provider-health degradation.

## Inputs
Run trace JSONL, provider health state, retry counters, portable checkpoint, tool ledger and fallback capability matrix.

## Preconditions
Trace timestamps use one clock domain; tool side effects have stable logical IDs; security policy is unchanged across candidate providers.

## Required context
Current task goal, completed/pending tools, approvals, provider-specific identifiers, credential owner, retry budget, latency SLO.

## Allowed tools
Trace parser, checkpoint validator, status APIs, read-only logs, `scripts/failover_analyzer.py`.

## Constraints
Do not expose secrets in traces. Do not replay side effects whose status is ambiguous. Do not migrate provider-specific IDs.

## Procedure
1. Measure baseline provider-call latency, retry count, successful terminal-response rate and tool-call completion rate.
2. Locate first provider failure and classify it.
3. Identify all provider-specific state created after the last safe checkpoint.
4. Reconcile completed side effects against the durable tool ledger.
5. Check fallback feature/schema compatibility.
6. Estimate failover versus bounded-retry cost using remaining SLO and retry budget.
7. Select `retry`, `failover`, `reconcile`, or `stop` and record evidence.
8. After recovery, measure total stall time, duplicate calls, terminal response and task completion.

## Decision points
Transient error with budget: retry. Provider-wide degradation plus compatible checkpoint: failover. Ambiguous side effect: reconcile first. Auth/schema/state-corruption/unknown without safe mapping: stop.

## Expected output
Machine-readable analysis with failure class, last safe checkpoint, retry budget, provider portability blockers, tool reconciliation status and recommended action.

## Metrics
p50/p95 recovery latency; retries/run; failover success rate; duplicate side effects; terminal-response coverage; provider-error attribution accuracy.

## Verification
Benchmark injected outages and confirm recovered runs preserve task/tool state with no duplicate side effects.

## Failure handling
Maximum two recovery attempts after classification. On ambiguous evidence, stop rather than guessing.

## Stop conditions
Retry budget exhausted, incompatible fallback, unverified side effect, security-policy mismatch, or missing durable checkpoint.
