# Production Safety and Approval Rules

## Purpose
Prevent build-system automation from exceeding its authority when actions can affect releases, production artifacts, credentials, or shared infrastructure.

## Scope
Applies to production publication, signing, destructive cache or artifact operations, privileged configuration, and high-impact shared build changes.

## MUST
- The build system MUST distinguish analysis, preparation, recommendation, and execution for privileged actions.
- Production publication, signing-policy changes, destructive artifact operations, and broad permission changes MUST require explicit authorized approval unless a pre-approved automated policy covers the exact action.
- High-risk actions MUST record actor, target, inputs, outcome, and relevant approval evidence.
- Rollback or containment procedures MUST exist for changes that can block releases across many projects.
- Automation MUST fail safely when authorization state is ambiguous.

## MUST NOT
- MUST NOT grant broader credentials to solve ordinary build failures.
- MUST NOT perform destructive cleanup of released artifacts or shared infrastructure without explicit authorization.
- MUST NOT bypass release gates through undocumented build-system overrides.

## SHOULD
- Privileged build steps SHOULD be isolated from ordinary compilation and test execution.
- Approval scope SHOULD be narrow and time-bounded where the platform supports it.

## Exceptions
Emergency authorization MUST be traceable to an incident or approved operational procedure and MUST receive post-action review.

## Verification
Inspect workflow permissions, approval gates, audit records, privileged worker configuration, release controls, and recovery procedures.