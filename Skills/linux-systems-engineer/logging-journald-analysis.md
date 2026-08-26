# Logging and journald Analysis

## Purpose
Use Linux logs as reliable operational evidence while controlling retention, access, and noise.

## When to use
Use for incident investigation, service failures, boot analysis, audit correlation, or logging design.

## Inputs
Failure window, service/host identity, journal/syslog configuration, retention requirements, and central logging topology.

## Context to inspect
Inspect journald persistence, forwarding, rate limits, rotation, time synchronization, service stdout/stderr handling, permissions, and centralized ingestion.

## Core knowledge
Understand structured journal fields, boot IDs, unit filtering, priorities, kernel messages, rotation/retention, rate limiting, and timestamp reliability.

## Procedure
1. Define incident time range and clock assumptions.
2. Query by unit, boot, PID, priority, and structured fields.
3. Correlate kernel, service, authentication, and dependency events.
4. Check for rate limiting, rotation, gaps, or forwarding failures.
5. Preserve relevant evidence before disruptive action.
6. Adjust logging only to answer a specific diagnostic need.
7. Restore safe verbosity and verify retention/forwarding.

## Decision points
Increase verbosity temporarily when current evidence is insufficient; centralize logs when host loss must not erase evidence; avoid logging sensitive payloads.

## Common failure patterns
Grepping without time context, ignoring clock skew, assuming missing logs mean no event, unlimited debug logging, and deleting logs to free space before preservation.

## Verification
Relevant events are queryable with correct timestamps, retention works, forwarding succeeds, and logging volume stays within capacity.

## Expected output
Correlated event timeline, evidence gaps, logging correction if needed, and validated retention path.

## Stop conditions
Stop if logs contain regulated secrets requiring special handling or retention changes require security/compliance approval.