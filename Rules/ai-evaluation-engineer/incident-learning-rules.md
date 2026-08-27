# Incident Learning Rules

## Purpose
Convert production AI failures into durable evaluation coverage and measurable prevention.

## Scope
Applies to safety incidents, severe quality failures, regressions, tool misuse, retrieval failures, policy breaches, and materially misleading AI behavior observed after release.

## MUST
- Significant AI incidents MUST produce one or more reproducible evaluation cases when technically and legally feasible.
- Incident-derived tests MUST capture the causal failure pattern, not merely the exact original wording.
- Root cause conclusions MUST be supported by traces, logs, reproduced behavior, configuration evidence, or equivalent artifacts.
- New incident-derived cases MUST be assigned severity and mapped to an owning evaluation suite or release gate.
- A corrective change MUST be evaluated both against the incident case and relevant neighboring cases to detect regressions or overfitting.

## MUST NOT
- MUST NOT close an AI quality incident solely because the exact reported prompt no longer fails.
- MUST NOT include raw sensitive incident data in shared benchmarks when a minimized or synthetic reproduction can preserve the failure mechanism.
- MUST NOT claim root cause from model behavior alone when system, retrieval, tool, or configuration causes remain plausible and untested.

## SHOULD
- Recurring failure patterns SHOULD trigger broader benchmark or taxonomy updates rather than isolated patches.
- Post-incident reviews SHOULD identify missing signals that could have detected the issue earlier.

## Exceptions
When an incident cannot be reproduced, the evaluation record MUST document attempted reproduction, available evidence, uncertainty, and compensating monitoring.

## Verification
Inspect incident records, reproduction artifacts, root-cause evidence, new regression cases, suite ownership, privacy controls, and follow-up evaluation results. Confirm the new test would have failed before the corrective change where evidence permits.