# Delivery and Review Playbook

## Planning heuristics
- Slice vertically around observable outcomes when possible.
- Make integration work explicit.
- Treat migrations, rollout, monitoring, and support readiness as delivery work.
- Preserve slack for discovery on uncertain tasks instead of pretending certainty.

## Review heuristics
Prioritize correctness and blast radius before elegance. Review contracts, data, permissions, concurrency, retries/timeouts, failure paths, observability, rollout, and tests.

## Dependency management
Every external dependency needs owner, expected date/condition, fallback, and escalation trigger. A dependency with no fallback belongs on the critical path.

## Technical debt
Accept debt only when consequence and repayment trigger are explicit. Do not create invisible debt by skipping tests or observability.

## Team scaling
Use shared contracts, small reusable checklists, and bounded subagents to reduce synchronization cost. Avoid one mega-agent owning exploration, implementation, review, and verification for high-risk changes.

## Metrics worth watching
Lead time, review wait time, failed deployment rate, escaped defects, rework loops, flaky checks, incident recurrence, and blocked dependency age. Use trends for diagnosis, not individual performance scoring.