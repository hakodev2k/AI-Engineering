# Serverless and Managed Service Rules
## Purpose
Use managed cloud capabilities without hiding operational or platform constraints.
## Scope
Functions, serverless runtimes, managed databases, queues, gateways, and platform services.
## MUST
- Service selection MUST evaluate quotas, scaling semantics, availability model, data guarantees, networking, security, observability, and exit constraints.
- Timeout, retry, concurrency, and idempotency behavior MUST be explicit for event-driven or serverless processing.
- Critical managed-service dependencies MUST have documented failure and recovery behavior.
## MUST NOT
- MUST NOT assume managed means maintenance-free or infinitely scalable.
- MUST NOT ignore platform limits that can cause throttling or data loss.
## SHOULD
- Prefer managed services when they materially reduce undifferentiated operational burden without unacceptable constraints.
## Exceptions
Exceptions require trade-off evidence and owner approval.
## Verification
Review service limits, configuration, load evidence, retry behavior, failure tests, SLAs, and dependency documentation.