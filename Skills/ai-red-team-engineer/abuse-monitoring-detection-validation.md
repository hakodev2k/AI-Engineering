# Abuse Monitoring and Detection Validation

## Purpose
Evaluate whether deployed monitoring can detect meaningful AI abuse patterns with enough context for response.

## When to use
Use when validating abuse controls, launching new capabilities, tuning alerts, or after incidents reveal telemetry gaps.

## Inputs
Logging schema, alerts, abuse taxonomy, test accounts, detection rules/models, retention constraints, and incident workflows.

## Context to inspect
Trace telemetry from request through model, retrieval, tools, policy decisions, and outcomes. Confirm privacy and access constraints on logs.

## Core knowledge
Detection must observe behavior at useful aggregation levels without collecting unnecessary sensitive content. Signals may include repeated policy probing, extraction-like query patterns, unusual tool sequences, tenant-boundary attempts, and high-risk action failures.

## Procedure
1. Map high-risk abuse scenarios to expected observable signals.
2. Verify required telemetry is captured and correlated.
3. Replay safe synthetic attack sequences.
4. Measure alert precision, recall, latency, and context quality.
5. Test distributed behavior across sessions or test identities where authorized.
6. Validate analyst triage paths and evidence retention.
7. Tune thresholds using benign high-volume controls.
8. Verify privacy minimization and access controls.
9. Add detection validation to release or periodic testing.

## Decision points
Prefer metadata and structured security events when raw content is unnecessary. Combine per-request controls with behavioral aggregation for slow attacks.

## Common failure patterns
Logging only refusals; no correlation IDs; alerts without actionable context; sensitive prompt logging by default; thresholds tuned only on attacks.

## Verification
Known synthetic abuse generates timely, actionable detections while representative benign workloads stay within acceptable false-positive limits.

## Expected output
Detection coverage evidence, telemetry gaps, tuning recommendations, and response handoff criteria.

## Stop conditions
Stop tests that could page real responders unexpectedly or contaminate production security metrics without prior coordination.