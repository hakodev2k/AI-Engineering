# Identity Architecture Rules

## Purpose
Establish secure, reviewable identity architecture across workforce, customer, service, and workload identities.

## Scope
Applies to identity providers, directories, authentication services, authorization systems, federation, privileged access, and identity integrations.

## MUST
- Identity trust boundaries MUST be explicitly documented before integration or migration work begins.
- Authentication, authorization, provisioning, and audit responsibilities MUST have clear system ownership.
- Identity decisions MUST preserve least privilege, revocability, traceability, and tenant isolation.
- New identity dependencies MUST document failure modes, fallback behavior, recovery objectives, and operational ownership.
- High-impact architecture changes MUST include rollback or containment strategy before production execution.

## MUST NOT
- Identity architecture MUST NOT rely on shared human accounts as a normal operating model.
- Authorization MUST NOT be inferred solely from successful authentication.
- Security boundaries MUST NOT depend on undocumented conventions or client-side enforcement.

## SHOULD
- Prefer centralized policy enforcement with explicit local exceptions over duplicated, divergent access logic.
- Prefer standards-based federation and identity protocols when they satisfy project requirements.

## Exceptions
Exceptions require documented rationale, compensating controls, risk, verification evidence, and accountable owner approval.

## Verification
Review architecture diagrams, trust relationships, configuration, threat models, access paths, failure tests, and rollback procedures.