# Dependency Failure Analysis

## Purpose
Determine whether an internal or external dependency is causing, amplifying, or masking an incident and choose resilient response actions.

## When to use
Use when downstream latency, errors, DNS, identity, storage, network, messaging, or third-party services may contribute to failure.

## Inputs
Dependency metrics, traces, status information, timeout/retry configuration, contracts, fallback behavior, and historical baselines.

## Context to inspect
Inspect connection pools, circuit breakers, DNS, TLS, quotas, rate limits, authentication, regional endpoints, queues, and client retry policies.

## Core knowledge
Dependency failures can manifest as local resource exhaustion. Timeouts, retries, and concurrency determine whether failure remains isolated or cascades.

## Procedure
1. Identify dependencies on the failing request path.
2. Compare their latency and error rates with baseline.
3. Check connection, DNS, TLS, authentication, quota, and rate-limit signals.
4. Inspect timeout and retry behavior for amplification.
5. Compare alternate regions, endpoints, or healthy consumers.
6. Determine whether local saturation is secondary to dependency slowness.
7. Apply circuit breaking, fallback, traffic reduction, or failover where safe.
8. Coordinate with dependency owners using evidence and timestamps.
9. Verify recovery independently rather than relying only on provider status.

## Decision points
Fail over when alternate capacity and data consistency are verified. Prefer fail-fast behavior when waiting or retrying only increases saturation.

## Common failure patterns
Trusting status pages as proof, retry storms, excessively long timeouts, ignoring DNS/TLS failures, and attributing local pool exhaustion to local code alone.

## Verification
Confirm dependency health and local resource recovery using telemetry from both sides where available.

## Expected output
A dependency assessment with evidence, amplification mechanisms, mitigations, and recovery status.

## Stop conditions
Escalate when failover risks data divergence, contractual action is required, or external access prevents adequate verification.