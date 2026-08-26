# Edge Compute Rules

## Purpose
Keep edge-executed code safe, bounded, observable, and compatible with caching semantics.

## Scope
Applies to edge functions, request/response transforms, personalization, authentication helpers, and runtime dependencies.

## MUST
- Edge code MUST have explicit execution, memory, network, and failure expectations.
- Changes affecting cache identity or authorization MUST be reviewed as correctness and security changes.
- External calls MUST use bounded timeouts and defined failure behavior.
- Edge code MUST emit sufficient diagnostics without exposing sensitive data.
- Runtime/version constraints MUST be pinned or deliberately managed.

## MUST NOT
- MUST NOT place secrets in client-visible responses, logs, or source.
- MUST NOT perform unbounded computation or network fan-out at the edge.
- MUST NOT silently convert edge failures into successful but incorrect responses.

## SHOULD
- Keep edge logic small and deterministic.
- Prefer origin logic when edge execution adds little latency or resilience value.
- Test representative points of presence and cold-start conditions.

## Exceptions
Complex edge workloads require documented benefit, resource evidence, failure analysis, ownership, and architecture review.

## Verification
Run unit and integration tests; inspect runtime limits, dependency inventory, logs, latency distributions, error rates, cache behavior, and failure injection results.