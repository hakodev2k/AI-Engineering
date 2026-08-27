# Code Review and Change Control
## Purpose
Ensure streaming changes are reviewed for semantic and operational risk.
## Scope
Pull requests, configuration, topology, schema, dependency, and runtime changes.
## MUST
- Reviews MUST assess event-time semantics, ordering, state, failure behavior, compatibility, resource impact, and observability when relevant.
- High-risk changes MUST include test evidence and rollback/recovery notes.
- Dependency changes MUST assess serialization, state compatibility, security, and runtime behavior.
## MUST NOT
- Generated plans or agent confidence MUST NOT substitute for executable evidence or reviewer judgment.
- Force pushes or history rewrites on protected/shared branches MUST NOT occur without explicit authorization.
## SHOULD
- Semantic changes SHOULD be separated from mechanical refactors.
## Exceptions
Emergency changes require incident authority and retrospective review.
## Verification
Inspect diffs, CI evidence, compatibility checks, approvals, and release notes.