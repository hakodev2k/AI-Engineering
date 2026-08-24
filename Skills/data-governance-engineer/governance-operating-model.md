# Governance Operating Model

## Purpose
Design a practical data-governance operating model that assigns decision rights, accountability, forums, and escalation paths without turning governance into bureaucracy.

## When to use
Use when establishing or redesigning enterprise/domain governance, clarifying ownership, or resolving recurring cross-team data decisions. Do not use governance forums as a substitute for engineering ownership.

## Inputs
Business objectives, organization structure, regulatory obligations, data domains, current policies, incident history, delivery workflows, stakeholder map.

## Context to inspect
Inspect existing councils, architecture/security/privacy processes, domain boundaries, decision bottlenecks, ownership gaps, and how changes reach production.

## Core knowledge
Effective governance separates policy, standards, execution, assurance, and exception management. Federated models usually balance enterprise consistency with domain autonomy. Decision rights must identify accountable owners, not committees collectively responsible for everything.

## Procedure
1. Identify outcomes governance must protect or enable.
2. Map material data domains and stakeholders.
3. Inventory existing decision forums and overlaps.
4. Define principles and scope.
5. Assign accountable data owners and operational stewards.
6. Define enterprise versus domain decision rights.
7. Establish lightweight forums only where cross-domain decisions require them.
8. Define policy lifecycle, exception, escalation, and evidence requirements.
9. Embed controls into delivery workflows and tooling where feasible.
10. Define KPIs for adoption, quality, risk, and decision latency.
11. Pilot with representative domains.
12. Review friction and refine the model.

## Decision points
Centralize decisions when consistency or regulation dominates; federate when domain context and delivery speed dominate. Automate repeatable controls; reserve human review for material judgment.

## Common failure patterns
Governance by committee, unclear accountability, policy without enforcement, duplicate forums, excessive approvals, vanity metrics, and ownership assigned to people without authority.

## Verification
Verify named accountable owners, documented decision rights, tested escalation paths, measurable controls, and evidence that representative delivery teams can follow the model without ambiguity.

## Expected output
An operating model defining roles, decision rights, forums, workflows, controls, metrics, and escalation paths.

## Stop conditions
Escalate when executive sponsorship, legal interpretation, authority boundaries, or critical domain ownership cannot be established.