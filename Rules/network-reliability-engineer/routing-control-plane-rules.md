# Routing Control Plane Rules

## Purpose
Keep routing behavior deterministic, bounded, and recoverable during normal operation and failure.

## Scope
Applies to dynamic routing protocols, route reflectors, route policies, convergence, and control-plane dependencies.

## MUST
- Routing policy MUST be explicit, reviewed, and version-controlled where practical.
- Critical routing domains MUST define expected convergence behavior and failure tolerance.
- Route advertisement changes MUST be validated for scope before production application.
- Control-plane resource saturation and session health MUST be observable.
- Route-policy changes MUST include rollback conditions.

## MUST NOT
- MUST NOT advertise prefixes beyond intended scope.
- MUST NOT introduce mutually recursive or unstable routing dependencies.
- MUST NOT rely on unbounded route redistribution without filters.
- MUST NOT treat control-plane session establishment as proof that forwarding is correct.

## SHOULD
- Prefer deterministic policy composition and minimal redistribution points.
- Test convergence under representative link and node failures.

## Exceptions
Exceptions require documented reason, expected propagation, blast radius, monitoring, and approval.

## Verification
Inspect route policy, routing tables, protocol state, convergence tests, telemetry, and rollback evidence.