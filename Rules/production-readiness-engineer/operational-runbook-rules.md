# Operational Runbook Rules
## Purpose
Ensure responders can operate and recover the system without relying on undocumented knowledge.
## Scope
Critical production services, scheduled jobs, data pipelines, integrations, and operational procedures.
## MUST
- Critical systems MUST have runbooks for common high-impact failure modes and recovery actions.
- Runbooks MUST state prerequisites, actions, expected outcomes, escalation points, and safety cautions.
- High-risk actions MUST identify approval requirements and recovery steps.
- Runbooks MUST be updated when production behavior or tooling changes materially.
- Readiness MUST confirm responders can access required documentation and tools.
## MUST NOT
- Runbooks MUST NOT contain plaintext secrets.
- Destructive commands MUST NOT appear without explicit warnings, scope checks, and authorization requirements.
- Runbooks MUST NOT depend on unavailable tribal knowledge.
## SHOULD
- Include decision trees and verification checkpoints for ambiguous incidents.
- Exercise critical runbooks through drills or controlled tests.
## Exceptions
Temporary absence requires a named owner, minimal emergency procedure, and remediation deadline.
## Verification
Review completeness, access, command safety, ownership, validation date, and drill or incident evidence.