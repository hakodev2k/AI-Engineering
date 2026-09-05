# AI Regulatory Landscape Mapping

## Purpose
Establish a reusable method for identifying laws, standards, contractual obligations, and internal policies that apply to an AI system. This prevents teams from implementing controls without knowing which obligations actually govern the use case.

## When to use
Use during product discovery, architecture review, market expansion, vendor onboarding, model changes, or compliance reassessment. Do not treat this Skill as legal advice; escalate legal interpretation when obligations are ambiguous.

## Inputs
Product scope, countries and regions, user populations, sectors, AI capabilities, data categories, deployment model, third-party providers, contractual commitments, existing policies.

## Preconditions
The system purpose, deployment geography, and major data flows are understood well enough to classify applicability.

## Context to inspect
Product requirements, architecture, model/provider inventory, privacy records, security controls, customer contracts, applicable standards, regulator guidance, organizational policies.

## Core knowledge
AI compliance is usually cumulative: privacy, cybersecurity, consumer protection, sector regulation, employment rules, accessibility, records obligations, and AI-specific requirements may overlap. Applicability depends on role, geography, risk, data, and use case—not only the model vendor.

## Procedure
1. Define system purpose, users, decisions, and geographies.
2. Identify regulated sectors and protected user groups.
3. Map relevant legal and policy domains.
4. Classify the organization’s role for each obligation.
5. Record mandatory, conditional, and voluntary requirements separately.
6. Link each obligation to system components and owners.
7. Mark unresolved legal interpretations.
8. Translate applicable obligations into control objectives.
9. Establish review triggers for regulatory or product change.
10. Store the mapping as versioned compliance evidence.

## Decision points
Distinguish binding law from guidance, customer requirements, and voluntary frameworks. Prefer the stricter control where multiple obligations overlap and the implementation burden is reasonable.

## Common failure patterns
Assuming vendor compliance transfers to the deployer, ignoring local sector rules, treating standards as law, failing to track system role, and creating a one-time mapping that is never revisited.

## Verification
Confirm every identified obligation has a source, applicability rationale, owner, and linked control or documented non-applicability decision.

## Expected output
A versioned regulatory applicability matrix with obligations, rationale, owners, controls, evidence, and review triggers.

## Stop conditions
Escalate when applicability depends on unresolved legal interpretation, cross-border restrictions, regulated high-risk activity, or conflicting obligations.