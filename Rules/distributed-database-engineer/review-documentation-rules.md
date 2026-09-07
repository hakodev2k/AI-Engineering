# Review and Documentation Rules

## Purpose
Preserve technical intent and ensure high-risk database changes receive effective scrutiny.

## Scope
Design reviews, code/configuration reviews, runbooks, architecture records, and operational documentation.

## MUST
- Material database changes MUST be reviewed by someone capable of evaluating correctness and operational risk.
- Reviews MUST examine data loss, compatibility, rollback, security, performance, and failure behavior where relevant.
- Documentation MUST describe current operational reality, not aspirational behavior.
- Runbooks MUST include prerequisites, safe commands or actions, validation, abort conditions, and escalation.

## MUST NOT
- MUST NOT approve a high-risk change based solely on superficial diff inspection.
- MUST NOT merge unresolved safety-critical review findings without explicit risk acceptance.
- MUST NOT leave obsolete recovery instructions active after topology changes.

## SHOULD
- Review evidence SHOULD be proportional to blast radius and irreversibility.

## Exceptions
Emergency review compression requires incident authorization and retrospective review.

## Verification
Inspect pull requests, design records, runbook tests, review comments, and documentation-to-system consistency.