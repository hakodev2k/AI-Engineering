# Configuration Incident Response

## Purpose
Provide disciplined investigation and recovery when configuration causes or contributes to an incident.

## Scope
Misconfiguration, unauthorized changes, propagation failures, stale state, control-plane failures, and unsafe rollouts.

## MUST
- Responders MUST preserve the relevant configuration revision, diff, actor, timing, and propagation evidence.
- Mitigation decisions MUST use available logs, metrics, traces, audit records, and service health evidence.
- Recovery MUST consider whether rollback is safe relative to current data, schema, and dependency state.
- Unauthorized or suspicious changes MUST be handled as a potential security incident.
- Emergency runtime fixes MUST be reconciled to the authoritative source after stabilization.

## MUST NOT
- Responders MUST NOT destroy audit evidence before capturing it.
- Broad configuration changes MUST NOT be made on unbounded hypotheses when a safer diagnostic step is available.
- A recovered service MUST NOT be treated as root-cause resolution without investigating why the unsafe configuration was accepted or propagated.

## SHOULD
- Correlate incident timelines with configuration revision events.
- Add validation, guardrails, or regression tests for preventable configuration failures.

## Exceptions
Immediate life-safety or severe outage mitigation may precede full evidence collection, but actions must remain attributable and evidence preservation should resume as soon as feasible.

## Verification
Review incident timelines, audit trails, rollback evidence, root-cause analysis, and corrective actions. Confirm follow-up work addresses the control failure, not only the triggering value.