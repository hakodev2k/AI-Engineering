# Access Request and Approval

## Purpose
Create access-request workflows that collect enough context for accountable decisions without turning approval into ineffective bureaucracy.

## When to use
Use when onboarding applications to IAM governance, redesigning manual access processes, or tightening sensitive-access approval.

## Inputs
Entitlement catalog, owners, requester populations, risk tiers, justification requirements, segregation rules, and SLA expectations.

## Context to inspect
Inspect request channels, current approvers, auto-approval rules, fulfillment, expiry, exception handling, audit records, and emergency processes.

## Core knowledge
Approval quality depends on decision context. Managers understand job need; resource owners understand entitlement risk. High-risk access may require both. Low-risk deterministic access can often be policy-driven.

## Procedure
1. Classify entitlements by risk and ownership.
2. Define who may request each entitlement.
3. Capture business justification and duration where relevant.
4. Route decisions to informed accountable approvers.
5. Enforce segregation-of-duties checks before fulfillment.
6. Auto-approve only low-risk deterministic cases.
7. Set expiry for temporary or exceptional access.
8. Make fulfillment idempotent and auditable.
9. Define escalation and timeout behavior.
10. Measure approval quality, latency, rejection, and exception rates.

## Decision points
Use manager approval for role relevance, resource-owner approval for sensitive resources, and automated policy for low-risk standard access. Additional approvers should reduce risk, not merely add signatures.

## Common failure patterns
Rubber-stamp approval, self-approval, unclear entitlement descriptions, missing duration, email-based fulfillment, approvals after access is already granted, and permanent temporary access.

## Verification
Trace requests from submission to effective access and expiry; verify unauthorized requesters, SoD conflicts, and self-approval are blocked.

## Expected output
A risk-based request and approval workflow with ownership, evidence, fulfillment, expiry, and metrics.

## Stop conditions
Escalate when no accountable approver exists or required access cannot be fulfilled/revoked reliably.