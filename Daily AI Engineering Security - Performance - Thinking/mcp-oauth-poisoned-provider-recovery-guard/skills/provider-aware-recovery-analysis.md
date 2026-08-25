# Skill — Provider-Aware MCP OAuth Recovery Analysis

## Purpose
Measure and diagnose OAuth-backed MCP reconnect failures that survive transport recreation.

## Trigger
Repeated connect/refresh timeout, lock ownership/auth-flow exception, or parked MCP server in a long-lived process.

## Inputs
Timestamped connection events, server ID, provider generation, latency, redacted error class/text, retry configuration.

## Preconditions
Capture a baseline before changing retry/provider lifecycle. Never expose access/refresh tokens.

## Required context
Last success, retry count, provider generation, whether a fresh process/provider succeeds, SDK/client versions.

## Allowed tools
Read logs, `scripts/oauth_recovery_guard.py`, test runner, safe local benchmark harness, public issue/docs lookup.

## Constraints
MUST NOT log tokens or authorization headers. MUST NOT increase retry limits before measuring. MUST isolate recovery to one MCP server/provider. SHOULD test fresh-provider recovery before whole-process restart.

## Procedure
1. Measure baseline: connect latency, retries, parked duration, warnings/hour, restart dependency.
2. Classify failures into ordinary transport, timeout accumulation, explicit lock/auth-flow signature, or unknown.
3. Feed redacted events to the guard.
4. For ordinary failure, allow bounded transport retry.
5. For poison signal, recreate provider state and increment generation.
6. Verify the next connection actually uses a new generation.
7. If poisoning repeats after configured recreations, open circuit and stop retries.
8. Compare recovery time and unrelated-server disruption with baseline.
9. Independent investigator verifies before claiming improvement.

## Decision points
Fresh provider succeeds while cached provider fails → provider-state hypothesis strengthened. Both fail → investigate remote/network/token validity. Recreated generation fails repeatedly → circuit/open escalation.

## Expected output
Baseline, classified failure evidence, recommended action sequence, before/after metrics, verification status.

## Metrics
Time-to-recovery, retries, provider recreations, circuit opens, p50/p95 latency, parked duration, warnings/hour, recovery without process restart.

## Verification
Unit tests plus replay of at least one ordinary network-failure trace and one lock-poison trace.

## Failure handling
Unknown failure is not automatically labeled poisoned; preserve evidence and use bounded retries. On circuit open, stop autonomous recovery and escalate.

## Stop conditions
Healthy success after fresh provider; circuit open; retry/recreation budget exhausted; insufficient evidence.
