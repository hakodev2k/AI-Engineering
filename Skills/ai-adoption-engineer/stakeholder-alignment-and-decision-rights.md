# Stakeholder Alignment and Decision Rights

## Purpose
Establish clear ownership, decision rights, and escalation paths for AI adoption so product, engineering, security, legal, operations, and business teams can move without governance ambiguity.

## When to use
Use for cross-functional pilots, enterprise rollouts, or any AI capability spanning multiple risk and operating domains.

## Inputs
Stakeholder map, governance policies, use-case scope, architecture, risk classification, support model, and business objectives.

## Context to inspect
Inspect approval processes, existing RACI models, policy owners, data owners, incident ownership, vendor management, and release authority.

## Core knowledge
AI adoption creates shared responsibility across model behavior, application behavior, data use, user decisions, and downstream effects. Senior practice assigns decisions to the team best positioned to own consequences, not simply the team building the feature.

## Procedure
1. Identify all decisions required from pilot through production.
2. Map stakeholders with authority, expertise, and operational responsibility.
3. Separate advisory roles from approval roles.
4. Assign an accountable owner for product value, technical operation, data, security, policy, and incidents.
5. Define escalation thresholds and response expectations.
6. Resolve conflicting objectives explicitly.
7. Document decision records and unresolved risks.
8. Review ownership again before scale-up or major model changes.

## Decision points
Centralize decisions where enterprise consistency or high risk matters; delegate routine implementation choices to delivery teams. Avoid consensus as a substitute for accountability.

## Common failure patterns
Unowned risks, duplicate approvers, security engaged only at launch, business owners delegating outcome accountability to engineers, and undocumented exceptions.

## Verification
For each material decision or incident type, a named role must have authority and a known escalation path.

## Expected output
A decision-rights matrix, escalation map, approval boundaries, and concise record of unresolved issues.

## Stop conditions
Stop when no accountable owner accepts a critical decision or when conflicting governance requirements cannot be reconciled.