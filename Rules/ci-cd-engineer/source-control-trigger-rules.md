# Source Control Trigger Rules

## Purpose
Ensure pipeline execution is intentional, reproducible, and resistant to unsafe source-control events.

## Scope
Push, pull request, tag, branch, path, manual, and scheduled triggers.

## MUST
- Trigger conditions MUST identify the source ref and event that authorizes each workflow.
- Protected-environment deployment MUST accept only approved refs or immutable release identifiers.
- Pull-request workflows MUST treat contributed code as untrusted when secrets or privileged tokens could be exposed.
- Path filters and branch filters MUST be tested when they can suppress required validation.
- Manual production triggers MUST record actor, target, revision, and approval evidence.

## MUST NOT
- MUST NOT deploy arbitrary fork code with privileged credentials.
- MUST NOT use mutable branch names as the sole evidence of release identity.
- MUST NOT skip required validation merely because a change appears documentation-only unless filters prove that assumption safely.

## SHOULD
- Expensive workflows SHOULD use precise filters without weakening required controls.
- Trigger rules SHOULD be simple enough for reviewers to predict execution from a change set.

## Exceptions
Any bypass requires documented reason, bounded scope, risk, compensating validation, and approval where production or secrets are affected.

## Verification
Inspect trigger configuration, protected-branch settings, fork behavior, representative change simulations, audit logs, and the revision recorded by produced artifacts.