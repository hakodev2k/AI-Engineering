# Triage and Stabilization Rules

## Purpose
Reduce harm quickly while preserving enough evidence to make safe recovery decisions.

## Scope
Initial diagnosis, containment, traffic management, feature controls, rollback, failover, and temporary mitigations.

## MUST
- Prioritize stopping customer or data harm before optimizing for complete root-cause certainty.
- Identify the smallest reversible action likely to reduce impact and define how success will be measured before execution.
- Capture essential volatile evidence when doing so does not materially delay urgent mitigation.
- Assign an owner and verification step to every mitigation.
- Reassess system state after each material intervention.

## MUST NOT
- Stack multiple unmeasured production changes when individual effects cannot be distinguished unless immediate safety requires it.
- Assume a deployment rollback is safe without checking schema, data, configuration, dependency, and compatibility effects.

## SHOULD
- Prefer reversible controls such as traffic shaping, feature isolation, graceful degradation, or known-good rollback paths.

## Exceptions
Immediate actions to prevent severe safety, security, or irreversible data harm may precede full evidence capture, but actions and rationale MUST be reconstructed afterward.

## Verification
Use telemetry and the incident timeline to show each mitigation, owner, expected effect, observed effect, and rollback or follow-up state.