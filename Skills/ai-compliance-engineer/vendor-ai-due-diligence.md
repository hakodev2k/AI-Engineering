# Vendor AI Due Diligence

## Purpose
Assess third-party AI providers for compliance, security, privacy, operational, and governance risk before adoption and throughout the relationship.

## When to use
Use for model APIs, hosted inference, AI SaaS, data-labeling vendors, model marketplaces, or material vendor changes.

## Inputs
Vendor architecture, data handling terms, security reports, subprocessors, model documentation, SLAs, retention practices, incident history, contract terms.

## Preconditions
The intended integration and data shared with the vendor are documented.

## Context to inspect
Procurement records, DPA, security assessment, model cards, provider policies, regional hosting, training-on-customer-data terms, deletion procedures, change notices.

## Core knowledge
Vendor compliance claims do not remove deployer obligations. Due diligence must evaluate actual integration risk: data transferred, model behavior, change control, subcontractors, audit rights, incident notification, and exit feasibility.

## Procedure
1. Define the vendor’s role and system dependency.
2. Classify data and workloads sent to the vendor.
3. Review security, privacy, and compliance evidence.
4. Assess model transparency and limitations.
5. Review retention, training, and deletion terms.
6. Review subprocessors and geographic transfers.
7. Assess incident and change-notification obligations.
8. Evaluate contractual audit, liability, and termination rights.
9. Identify compensating controls and residual risk.
10. Set reassessment triggers and monitoring cadence.

## Decision points
Require stronger controls for sensitive data, critical decisions, opaque models, or providers with weak change-notification commitments. Avoid lock-in where compliance exit requirements are foreseeable.

## Common failure patterns
Accepting certifications without scope review, ignoring model changes, failing to test deletion commitments, and assuming standard terms cover AI-specific risks.

## Verification
Confirm evidence supports claims, contract terms match technical use, and identified risks have owners and controls.

## Expected output
A vendor risk assessment with evidence, gaps, contractual requirements, approval decision, and reassessment triggers.

## Stop conditions
Escalate when the vendor cannot explain data use, refuses required contractual protections, or creates unacceptable regulatory or concentration risk.