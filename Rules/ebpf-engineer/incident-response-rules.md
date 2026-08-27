# Incident Response

## Purpose
Control risk and preserve evidence when eBPF components contribute to or investigate production incidents.

## Scope
Outages, enforcement failures, overhead regressions, incorrect telemetry, emergency disablement, and forensic use.

## MUST
- Incident actions MUST distinguish observation, recommendation, preparation, and execution authority.
- Production detach, policy bypass, privilege change, or destructive cleanup MUST require authorized human approval unless covered by an approved emergency procedure.
- Responders MUST preserve relevant program/map/link state and artifact identity before destructive remediation when feasible.
- Emergency disablement MUST have a known restoration path.
- Conclusions MUST be grounded in kernel state, logs, metrics, traces, or equivalent evidence.

## MUST NOT
- MUST NOT force-push or rewrite repository history as incident remediation.
- MUST NOT destroy pinned state before determining whether it is needed for recovery or evidence.
- MUST NOT claim root cause when evidence only establishes correlation.

## SHOULD
- Maintain tested runbooks for detach, bypass, rollback, and evidence capture.
- Record timeline and exact commands/actions used.

## Exceptions
Immediate life/safety or severe outage procedures may prioritize containment but require subsequent evidence capture and review.

## Verification
Review incident records, approvals, captured state, rollback execution, and root-cause evidence.