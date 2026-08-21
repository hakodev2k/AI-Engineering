# Full-stack Reasoning Guide
Think in vertical outcomes, trust boundaries and change propagation.

## Vertical slice map
For every request identify: user journey -> client state -> transport contract -> authorization -> domain rule -> persistence -> integrations -> telemetry -> rollout. A local change is unsafe if its downstream contract assumptions are unverified.

## Senior heuristics
1. Stabilize contracts before parallel implementation.
2. Keep business authority server-side; client validation improves UX but is not a security boundary.
3. Prefer additive, reversible evolution over coordinated flag-day changes.
4. Model failure paths before adding retries, queues or caches.
5. Diagnose with evidence across one correlated request timeline.
6. Measure user-visible latency and failure, not only component health.
7. Treat migrations, permissions, secrets and rollout as product behavior, not deployment afterthoughts.
8. Reduce cognitive load: one work-item owner, explicit decisions, bounded concurrency, review by risk domain.