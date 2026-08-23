# Self-Service Platform Workflows

## Purpose
Turn recurring platform requests into safe self-service workflows that increase developer autonomy without bypassing governance.

## When to use
Use when teams wait on tickets for environments, resources, permissions, service creation, or routine operational changes.

## Inputs
Request history, platform APIs, policies, ownership, approval rules, quotas, and audit requirements.

## Context to inspect
Inspect manual handoffs, failure recovery, permissions, policy checks, lifecycle cleanup, and exception paths.

## Core knowledge
Self-service requires guardrails, sensible defaults, idempotency, observability, ownership, and lifecycle management—not merely a web form.

## Procedure
1. Rank requests by frequency and wait cost.
2. Model the complete lifecycle and policy constraints.
3. Define a supported paved-road workflow.
4. Encode validation and policy automatically.
5. Make operations idempotent where possible.
6. Provide status, errors, and recovery guidance.
7. Record ownership and audit evidence.
8. Automate cleanup and expiration where relevant.
9. Pilot and measure ticket reduction and success rate.

## Decision points
Automate approvals when policy can be evaluated deterministically; retain human approval for contextual high-risk decisions.

## Common failure patterns
Automating only provisioning, missing deletion, excessive permissions, no ownership metadata, and self-service that still requires hidden manual steps.

## Verification
Exercise create, retry, duplicate, failure, cleanup, unauthorized, and exception paths and confirm auditability.

## Expected output
A guarded self-service workflow with lifecycle automation, diagnostics, ownership, and measurable adoption.

## Stop conditions
Escalate when policy cannot be encoded safely, required APIs are unavailable, or automation would grant unapproved privilege.