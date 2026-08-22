# Multi-Account Governance Rules
## Purpose
Contain risk and establish enforceable organizational boundaries.
## Scope
AWS Organizations, accounts, OUs, SCPs, account vending, ownership, and shared services.
## MUST
- Separate materially different environments or trust boundaries using accounts when blast-radius reduction justifies it.
- Assign accountable owners, purpose, contacts, and lifecycle status to governed accounts.
- Test SCP changes against required operational and recovery paths before broad rollout.
- Preserve a controlled emergency-access path that organizational policy cannot accidentally eliminate.
## MUST NOT
- Use production accounts as general-purpose sandboxes.
- Apply organization-wide deny policies without impact analysis and rollback preparation.
## SHOULD
- Standardize account baselines, logging, security services, budgets, and tags through automation.
## Exceptions
Exceptions require scope, rationale, risk, expiry or review date, and governance approval.
## Verification
Inspect Organizations structure, SCPs, account inventory, baseline deployment evidence, ownership metadata, and policy tests.