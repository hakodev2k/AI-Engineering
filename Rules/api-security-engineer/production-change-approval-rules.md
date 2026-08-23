# Production Change and Approval Rules

## Purpose
Prevent security-sensitive API changes from exceeding authority or creating uncontrolled production risk.

## Scope
Production configuration, security controls, identity policy, secrets, public contracts, gateways, and emergency changes.

## MUST
- Distinguish analysis, recommendation, preparation, approval, and execution authority.
- Require human approval appropriate to risk before weakening security controls, rotating production secrets, changing privileged access, breaking public contracts, or making irreversible production changes.
- Define rollback or containment plans for material security changes where technically possible.
- Preserve an auditable record of approval and executed change.

## MUST NOT
- Force push, rewrite shared history, bypass required review, or disable security gates to expedite a change.
- Treat AI-agent confidence as approval or evidence.

## SHOULD
- Prefer reversible, staged, observable changes with limited blast radius.

## Exceptions
Emergency procedures may shorten normal workflow only under documented incident authority and retrospective review.

## Verification
Inspect approvals, change records, diffs, deployment evidence, rollback plans, access logs, and post-change validation.