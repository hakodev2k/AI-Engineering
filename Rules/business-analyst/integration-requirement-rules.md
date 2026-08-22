# Integration Requirement Rules

## Purpose
Prevent business failures at system and organizational boundaries.
## Scope
APIs, files, messages, external providers, handoffs, and cross-system workflows.
## MUST
- Define source, destination, ownership, trigger, data meaning, timing, error handling, reconciliation, and business fallback for material integrations.
- Identify contract, dependency, security, privacy, and operational impacts.
- Clarify behavior for duplicate, delayed, missing, or invalid exchanges where relevant.
## MUST NOT
- Assume external systems are always available or data is always valid.
- Change a shared business contract without affected-owner review.
## SHOULD
- Document business-level idempotency and recovery expectations for critical flows.
## Exceptions
Prototype integrations may use reduced controls only outside production commitments.
## Verification
Review interface requirements, failure scenarios, dependency approvals, reconciliation, and acceptance evidence.