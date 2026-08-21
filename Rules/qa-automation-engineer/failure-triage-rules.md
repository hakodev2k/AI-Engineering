# Failure Triage Rules

## Purpose
Classify automation failures from evidence so product defects, test defects, and infrastructure incidents receive correct action.

## Scope
Applies to failed CI runs, scheduled suites, local reproductions, and release-gate failures.

## MUST
- Triage MUST preserve the original failure evidence before reruns can overwrite it.
- Classification MUST distinguish at minimum product, test, data, environment/infrastructure, and unknown causes when evidence permits.
- Repeated unknown failures MUST be investigated rather than normalized.
- Critical product failures MUST retain reproducible steps or equivalent diagnostic evidence.

## MUST NOT
- MUST NOT close a failure as flaky solely because a rerun passed.
- MUST NOT change assertions to match unexpected behavior without confirming intended requirements.
- MUST NOT blame infrastructure without supporting evidence.

## SHOULD
- Correlate failures with deployments, environment events, logs, traces, and recent test changes.
- Track recurring causes and remediation effectiveness.

## Exceptions
Urgent release decisions may use bounded provisional classification with explicit uncertainty and human ownership.

## Verification
Review failure artifacts, rerun history, classification records, linked defects, and root-cause evidence.