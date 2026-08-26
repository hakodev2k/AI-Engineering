# Gateway Architecture

## Purpose
Protect API gateway boundaries and prevent the gateway from becoming an uncontrolled application layer.

## Scope
Applies to gateway topology, routing ownership, policy placement, and service boundaries.

## MUST
- Gateway responsibilities MUST be explicitly limited to cross-cutting edge concerns such as routing, protocol mediation, authentication enforcement, traffic policy, and observability.
- Route ownership and upstream dependencies MUST be documented and reviewable.
- Architecture changes MUST identify blast radius, failure modes, rollback path, and compatibility impact.
- Business rules placed at the gateway MUST have an explicit architectural justification.

## MUST NOT
- MUST NOT turn the gateway into a shared domain-logic monolith.
- MUST NOT create hidden service-to-service dependencies through routing tricks.
- MUST NOT introduce a new gateway tier without evidence that existing topology cannot meet requirements.

## SHOULD
- Policy and routing configuration SHOULD be declarative, version-controlled, and independently testable.
- Gateway layers SHOULD remain horizontally scalable and replaceable.

## Exceptions
Exceptions require documented context, alternatives, risk, rollback, verification evidence, and approval from the accountable architecture owner.

## Verification
Review topology diagrams, route inventory, configuration diff, architecture tests, dependency graphs, failure tests, and rollback evidence.