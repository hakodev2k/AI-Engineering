# Troubleshooting and Root Cause Rules

## Purpose
Make diagnosis evidence-driven, bounded, and reproducible instead of relying on folklore or destructive trial and error.

## Scope
Applies to host, service, process, kernel, network, storage, and resource investigations.

## MUST
- Investigations MUST define the observed symptom, expected behavior, affected scope, onset, and relevant recent changes.
- Hypotheses MUST be tested against evidence and updated when observations contradict them.
- Diagnostic commands MUST be chosen with awareness of their load, locking, privacy, and production impact.
- Root-cause conclusions MUST distinguish proven cause, contributing factors, and unresolved uncertainty.
- Corrective actions MUST address recurrence risk when the root cause is sufficiently established.

## MUST NOT
- Correlation with a recent change MUST NOT automatically be presented as causation.
- Broad configuration changes MUST NOT be made solely to see whether the problem disappears when narrower tests are available.
- Absence of an error message MUST NOT be treated as proof of healthy behavior.

## SHOULD
- Compare healthy and unhealthy systems when configuration and workload differences are controlled.
- Prefer read-only diagnostics before mutating state.
- Preserve minimal reproductions and evidence for recurring problems.

## Exceptions
Urgent mitigation can precede complete root-cause analysis, but uncertainty and follow-up investigation MUST be explicit.

## Verification
Review the evidence chain, reproduction steps, telemetry, commands executed, alternative hypotheses considered, and tests showing that the corrective action prevents or detects recurrence.