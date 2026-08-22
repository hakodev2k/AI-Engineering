# Indexation Rules
## Purpose
Control which URLs are eligible for search indexes and prevent accidental visibility loss or index bloat.
## Scope
Meta robots, X-Robots-Tag, indexability, duplicate URLs, and removal workflows.
## MUST
- Define indexability from explicit page purpose and canonical strategy.
- Test noindex, robots, authentication, and status-code interactions before production changes.
- Investigate material indexed-versus-intended discrepancies with URL-level evidence.
## MUST NOT
- Apply broad noindex directives without impact analysis and rollback plan.
- Assume a URL is indexed merely because it is crawlable or present in a sitemap.
## SHOULD
- Remove low-value duplicate URL generation at the source rather than relying indefinitely on cleanup directives.
## Exceptions
Temporary noindex may support migrations or staged launches when monitored and time-bounded.
## Verification
URL inspection, index coverage reports, crawler output, rendered headers, and representative search checks.