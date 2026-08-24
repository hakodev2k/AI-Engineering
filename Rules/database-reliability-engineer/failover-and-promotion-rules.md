# Failover and Promotion Rules

## Purpose
Make failover predictable, bounded, and recoverable.

## Scope
Automatic and manual failover, leader election, promotion, fencing, and rollback.

## MUST
- Define failover triggers, authority, fencing behavior, and recovery checkpoints.
- Test failover under representative dependency and network failure modes.
- Prevent split-brain through deterministic fencing or quorum controls.
- Validate client reconnection and write correctness after promotion.

## MUST NOT
- Do not execute production failover without an approved runbook except during declared incident response.
- Do not assume promotion is complete until application traffic and replication are verified.

## SHOULD
- Prefer rehearsed automation with human-observable checkpoints over ad hoc commands.

## Exceptions
Emergency actions must be documented after stabilization with evidence and follow-up remediation.

## Verification
Inspect failover tests, runbooks, fencing configuration, incident records, and post-promotion checks.