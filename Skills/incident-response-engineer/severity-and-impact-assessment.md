# Severity and Impact Assessment

## Purpose
Assign defensible incident severity from business and technical impact so response effort, communications, and escalation match the risk.

## When to use
Use at incident declaration and whenever scope or impact materially changes.

## Inputs
Affected capabilities, customer counts, duration, regions, data sensitivity, contractual obligations, financial exposure, workarounds, and recovery estimates.

## Context to inspect
Inspect service criticality, SLOs, dependency graph, customer tiers, regulatory constraints, operational calendar, and known downstream effects.

## Core knowledge
Severity is a coordination mechanism. It should be based on impact dimensions and uncertainty, not the seniority of the reporter or perceived technical complexity. Reclassification is normal as evidence improves.

## Procedure
1. Identify unavailable or degraded business capabilities.
2. Quantify affected users, transactions, data, and geography.
3. Assess confidentiality, integrity, availability, compliance, and safety impact.
4. Determine whether a viable workaround exists.
5. Estimate current duration and plausible worsening scenarios.
6. Map evidence to the organization's severity rubric.
7. Increase urgency when uncertainty hides potentially catastrophic impact.
8. Document rationale and assumptions.
9. Reassess after each major containment or scope discovery.

## Decision points
Choose the higher severity when credible evidence spans two levels and delay would materially harm response. Downgrade only after impact reduction is verified, not merely after a mitigation is deployed.

## Common failure patterns
Using only uptime, ignoring integrity or security impact, counting alerts instead of customers, failing to reassess, and lowering severity to reduce organizational attention.

## Verification
Confirm the chosen level maps to documented criteria and that communications, staffing, and escalation obligations for that level are active.

## Expected output
A severity decision with quantified impact, rationale, uncertainty, and reassessment triggers.

## Stop conditions
Escalate when required business, legal, security, or compliance impact cannot be determined by the response team.