# Workflow: Production Incident Investigation

## Trigger
Production backend degradation, error spike, data inconsistency, queue backlog, or dependency failure.

## Goal
Reduce user impact, establish evidence, identify root cause, and deliver a verified corrective action without unsafe autonomous production changes.

## Inputs
Impact, timeline, alerts, logs/traces/metrics, deployment history, affected components, incident permissions.

## Stages
1. **Triage — Primary role:** classify severity, users affected, current blast radius, and immediate safe diagnostics.
2. **Stabilization recommendation — Primary role:** propose reversible mitigation; any production execution requires authorized human approval.
3. **Parallel evidence collection:** Repository Explorer traces code; Database Investigator checks persistence evidence; runtime evidence is collected from logs/metrics/traces.
4. **Hypothesis consolidation — Primary role:** rank hypotheses and identify evidence that would confirm/refute each.
5. **Controlled investigation:** test one hypothesis at a time in safe environments/read-only production tooling.
6. **Root cause decision:** distinguish confirmed root cause, contributing factors, and unresolved uncertainty.
7. **Correction — Implementation Agent:** smallest safe fix plus regression tests.
8. **Review — Code Reviewer.**
9. **Verification — Verification Agent.**
10. **Prevention:** monitoring, test, rule, checklist, or design improvement justified by the evidence.

## Parallelism
Code-path tracing, database read-only analysis, deployment comparison, and observability review can run concurrently. Do not run competing production mutations in parallel.

## Retry policy
Transient read-only evidence queries may retry twice. Failed mitigation or tool access is escalated; never retry destructive/production actions automatically.

## Failure path
Insufficient evidence → preserve timeline, add safe instrumentation when approved, reduce confidence explicitly, and continue monitoring rather than inventing a cause.

## Checkpoints
- Severity and blast radius recorded.
- Stabilization action is reversible and approved before execution.
- Root cause statement cites evidence.
- Fix passes review and verification.

## Definition of Done
Impact is resolved or handed off with explicit status; root cause/confidence is documented; corrective action is verified; prevention items have owners or are consciously deferred.
