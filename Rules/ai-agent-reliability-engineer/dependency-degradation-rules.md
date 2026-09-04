# Dependency Degradation Rules

## Purpose
Keep agent workflows safe and intelligible when models, tools, storage, queues, or external services become slow, unavailable, or partially functional.

## Scope
Applies to all external and internal dependencies required by an agent workflow.

## MUST
- Dependencies MUST be classified as critical, optional, or substitutable for each consequential workflow.
- Critical dependency failure MUST produce a defined failure or degraded-mode outcome rather than implicit behavior.
- Degraded responses MUST explicitly indicate when expected evidence, actions, or capabilities were unavailable if that absence affects correctness.
- Circuit breaking, bulkheading, throttling, or equivalent controls MUST be used where dependency failure can amplify load or consume unbounded agent resources.
- Fallback paths MUST preserve authorization, data-isolation, and safety requirements of the primary path.
- Dependency health and degradation state MUST be observable at run and service level.

## MUST NOT
- Security, authorization, validation, or audit controls MUST NOT be disabled merely because a dependency is degraded.
- Optional dependency failure MUST NOT silently change a consequential answer into an apparently complete result.
- Layered retries MUST NOT create cascading load against a failing dependency.

## SHOULD
- Workflows SHOULD prefer useful partial completion over fabricated completion when optional dependencies fail.
- Critical dependencies SHOULD have explicit recovery objectives and tested failure modes.

## Exceptions
Exceptions require documented dependency behavior, bounded blast radius, alternative controls, evidence from failure testing, and owner approval when safety guarantees are weakened.

## Verification
Inject dependency latency, errors, partial responses, and outages. Verify circuit behavior, degraded-mode labeling, safety invariants, recovery, resource usage, and absence of retry amplification.