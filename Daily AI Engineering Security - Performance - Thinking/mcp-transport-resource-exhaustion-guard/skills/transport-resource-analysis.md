# Skill: Transport Resource Analysis

## Purpose
Identify and verify finite resource bounds for MCP HTTP/SSE transports.

## Trigger
MCP SDK upgrade, new remote endpoint, transport-mode change, memory spike, or security advisory.

## Inputs
Dependency versions, transport role, exposure, buffer/session metrics, timeout configuration, process memory data.

## Preconditions
Read-only access to deployment configuration and representative telemetry.

## Required context
Only transport configuration, dependency metadata, and measured resource data.

## Allowed tools
Dependency inspection, process metrics, unit/integration tests, `scripts/resource_guard.py`.

## Constraints
MUST NOT generate live denial-of-service traffic against third-party systems. Adversarial tests MUST target local fixtures or authorized staging systems.

## Procedure
1. Record exact SDK version and transport mode.
2. Establish baseline buffer/session/RSS metrics under normal workload.
3. Identify every peer-controlled retained object or byte buffer.
4. Verify each has a finite bound or TTL independent of peer cooperation.
5. Run deterministic guard against baseline observations.
6. In a local fixture, simulate delimiter withholding and initialize/disconnect floods within safe test limits.
7. Compare peak memory and retained state against configured limits.
8. If violated, patch/upgrade/configure and repeat at most twice.

## Decision points
Any unbounded attacker-influenced resource or missing cleanup deadline blocks release.

## Expected output
Facts, evidence, root cause, effective limits, before/after metrics, verification status.

## Metrics
Peak buffered bytes, active sessions, idle lifetime, RSS, OOM/crash count.

## Verification
Independent reviewer confirms bounds are finite and tests cover the failure mode.

## Failure handling
Disable remote transport or narrow exposure when a finite bound cannot be proven.

## Stop conditions
Maximum 2 remediation iterations; stop immediately on OOM, uncontrolled process growth, or production impact.
