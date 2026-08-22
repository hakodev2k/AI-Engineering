# SEO Change Management Rules
## Purpose
Make search-affecting changes reviewable, reversible, and attributable.
## Scope
Templates, routing, metadata, robots, canonicals, redirects, structured data, content systems, and platform changes.
## MUST
- Identify affected URL populations, expected behavior, risk, owner, validation method, and rollback path for material changes.
- Review high-impact search controls before production deployment.
- Record release timing so performance changes can be correlated with implementation.
- Require human approval before destructive URL removal, domain changes, broad redirect/noindex changes, or weakening controls.
## MUST NOT
- Execute high-blast-radius SEO changes solely from agent recommendation without authorized review.
- Mix unrelated risky changes when separation is practical.
## SHOULD
- Roll out high-risk template changes progressively when architecture permits.
## Exceptions
Emergency fixes may use accelerated approval while preserving evidence and rollback capability.
## Verification
Change request, diff, test evidence, approval record, deployment log, and post-release monitoring.