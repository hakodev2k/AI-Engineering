# Root Cause Analysis

## Purpose
Require evidence-based diagnosis of ML production failures and prevent broad corrective action based on plausible but unverified explanations.

## Scope
Applies to investigations involving models, data, features, labels, serving systems, monitoring, and dependencies.

## MUST
- Root-cause analysis MUST construct and test hypotheses against timestamps, deployments, telemetry, lineage, and reproducible evidence.
- Investigations MUST separate initiating cause, contributing conditions, detection gaps, and impact amplifiers when they differ.
- Corrective actions MUST map to identified or explicitly bounded failure mechanisms.
- Unknowns that affect confidence in the conclusion MUST remain documented.

## MUST NOT
- MUST NOT treat agent or investigator confidence as evidence.
- MUST NOT stop at the first correlated change when competing explanations remain credible.
- MUST NOT assign individual blame in place of analyzing system controls and failure mechanisms.

## SHOULD
- Reproduce the failure or construct a controlled counterfactual when practical.
- Preserve queries, traces, evaluation outputs, and configuration snapshots that support conclusions.

## Exceptions
When a definitive cause cannot be established, the incident may be closed only with bounded hypotheses, residual risk, monitoring improvements, and accountable approval.

## Verification
Review incident reports for evidence links, tested hypotheses, causal reasoning, corrective-action traceability, and validation after remediation.