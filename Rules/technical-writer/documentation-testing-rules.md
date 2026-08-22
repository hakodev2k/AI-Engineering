# Documentation Testing Rules
## Purpose
Treat executable and structural documentation quality as verifiable engineering work.
## Scope
Links, snippets, commands, schemas, builds, examples, navigation, and generated content.
## MUST
- Automate deterministic checks for broken links, malformed markup, generated-reference drift, and executable examples where feasible.
- Test critical user procedures against representative supported environments before publication.
- Fail or explicitly gate publication when a high-severity documentation test fails.
- Keep test fixtures free of real secrets and production dependencies.
## MUST NOT
- Mark content verified solely because it rendered successfully.
- Ignore flaky documentation tests indefinitely without owner and remediation decision.
## SHOULD
- Run documentation tests in CI near the source changes that can invalidate content.
## Exceptions
Non-automatable claims require documented manual evidence and reviewer accountability.
## Verification
Inspect CI results, procedure test records, link reports, example execution, and unresolved test exceptions.