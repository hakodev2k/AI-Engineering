# Application Detection Rules

## Purpose
Define detections for abuse of applications, APIs, services, and business logic.

## Scope
Applies to application logs, API gateways, authentication events, audit trails, and service telemetry.

## MUST
- Application detections MUST use documented event semantics and stable identifiers rather than free-text messages when structured fields exist.
- Security-relevant business actions MUST be detectable with actor, target, action, outcome, and time context where feasible.
- Detections for abuse patterns MUST distinguish expected high-volume automation from suspicious behavior.
- Missing audit coverage for privileged or destructive application actions MUST be treated as a security gap.

## MUST NOT
- MUST NOT infer successful sensitive actions from request receipt alone when outcome telemetry exists.
- MUST NOT log or expose secrets, tokens, or sensitive payloads merely to improve detection.
- MUST NOT rely on client-supplied identity attributes without server-side validation.

## SHOULD
- Detections SHOULD correlate application actions with identity, device, network, and authorization context.
- Rules SHOULD emphasize abuse cases that bypass infrastructure-level controls.

## Exceptions
Exceptions require documented logging constraints, risk, alternative evidence, owner, and review date.

## Verification
Inspect audit schemas, replay abuse scenarios, validate actor/target/outcome fields, and review coverage of privileged actions.