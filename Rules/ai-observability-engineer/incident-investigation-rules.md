# Incident Investigation Rules

## Purpose
Define evidence-driven investigation practices for AI production incidents and regressions.

## Scope
Applies to reliability, quality, latency, cost, model, retrieval, tool, and telemetry incidents.

## MUST
- Incident investigation MUST begin from observable symptoms, affected scope, and time boundaries before assigning a root cause.
- Investigators MUST preserve relevant traces, metrics, logs, deployment metadata, model versions, and evaluation evidence before ephemeral data expires.
- Hypotheses MUST be recorded and tested against evidence; disproven hypotheses MUST be discarded.
- User-visible impact MUST be separated from internal component symptoms.
- Root cause MUST distinguish triggering event, contributing conditions, and detection or response gaps where evidence supports them.
- Remediation claims MUST be verified using post-change production or controlled-test evidence.

## MUST NOT
- Agent or operator confidence MUST NOT be treated as evidence.
- A coincident deployment MUST NOT automatically be declared causal.
- Missing telemetry MUST NOT be silently filled with assumptions.
- Incident closure MUST NOT rely solely on disappearance of an alert if user-impact evidence remains unresolved.

## SHOULD
- Build timelines from correlated machine evidence before relying on recollection.
- Capture observability gaps as explicit follow-up work.

## Exceptions
When evidence is irretrievable, conclusions must be labeled bounded or uncertain and remediation should favor reversible risk reduction.

## Verification
Review incident records for evidence links, hypothesis testing, causal boundaries, post-fix validation, and observability follow-ups.