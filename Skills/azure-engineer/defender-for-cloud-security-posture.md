# Defender for Cloud Security Posture

## Purpose
Use Microsoft Defender for Cloud and Azure security signals to identify, prioritize, and reduce exploitable cloud risk.

## When to use
Use for Azure security posture reviews, workload onboarding, vulnerability prioritization, and cloud-security remediation programs.

## Inputs
Subscription scope, workload criticality, regulatory requirements, Defender plans, ownership model, and acceptable risk.

## Context to inspect
Inspect Defender plans, recommendations, secure score, regulatory mappings, attack paths, vulnerability findings, resource exposure, exemptions, and security alerts.

## Core knowledge
Security posture tools produce findings, not automatic truth. Prioritization should combine exposure, asset criticality, exploitability, attack paths, compensating controls, and remediation risk.

## Procedure
1. Confirm coverage and enabled Defender plans for relevant subscriptions.
2. Inventory internet-exposed and high-value resources.
3. Review attack paths and high-severity recommendations first.
4. Validate findings against actual configuration and workload context.
5. Rank remediation by risk reduction and implementation safety.
6. Assign owners and deadlines.
7. Automate repeatable configuration fixes through IaC/policy.
8. Record justified exemptions with expiry.
9. Monitor security alerts and integrate response routing.
10. Reassess posture after remediation and architecture changes.

## Decision points
Fix exploitable exposure before optimizing score percentages. Accept or exempt findings only when compensating controls and business justification are documented.

## Common failure patterns
Chasing secure score mechanically, enabling plans without response ownership, permanent exemptions, treating recommendations as false-positive-free, and manual fixes that drift back.

## Verification
Confirm remediated resources disappear from validated findings after reevaluation, test policy/IaC prevention, and verify security alerts route to an owned response process.

## Expected output
A risk-prioritized cloud-security backlog with validated findings, durable remediations, owners, and residual-risk records.

## Stop conditions
Stop when remediation may disrupt critical production access, a finding requires application-owner validation, or risk acceptance lacks an authorized approver.