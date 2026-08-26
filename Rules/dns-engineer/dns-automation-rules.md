# DNS Automation Rules

## Purpose
Automate DNS safely without allowing silent high-impact mutation.

## Scope
Infrastructure as code, DNS APIs, reconciliation, CI/CD, and operational scripts.

## MUST
- Automation MUST be deterministic or explicitly reconcile current and desired state.
- Automation MUST validate inputs and surface partial failures.
- Destructive, security-sensitive, or public-contract changes MUST require approval proportional to impact.

## MUST NOT
- MUST NOT embed secrets in automation source or generated logs.
- MUST NOT execute broad deletes based on ambiguous discovery results.
- MUST NOT let an AI agent silently exceed granted execution authority.

## SHOULD
- Automation SHOULD support dry-run or diff preview for material changes.

## Exceptions
Emergency automation bypass requires incident authorization and complete audit evidence.

## Verification
Review code, permissions, dry-run output, CI checks, failure tests, audit logs, and idempotency behavior.