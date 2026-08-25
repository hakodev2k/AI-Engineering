# Drift Detection and Remediation

## Purpose
Detect and resolve divergence between Terraform configuration, state, and provider reality.

## When to use
Scheduled drift checks, incidents, unexpected plans, or manual emergency changes.

## Inputs
Configuration, state, refresh plan, audit logs, provider inventory.

## Context to inspect
Recent applies, console changes, controllers, provider defaults, ignored attributes, ownership.

## Core knowledge
Drift may be accidental, authorized, controller-driven, or malicious. Establish the correct source of truth before remediation.

## Procedure
1. Generate a refresh-aware plan without source changes.
2. Classify each delta by risk.
3. Correlate with audit/change records.
4. Decide whether code or infrastructure is desired.
5. Codify legitimate changes or plan reversal.
6. Remove conflicting managers or define ownership.
7. Apply through normal gates.
8. Recheck drift and document root cause.

## Decision points
Use ignore_changes only for attributes intentionally owned elsewhere. Escalate sensitive IAM/network drift.

## Common failure patterns
Blind apply, blanket ignores, confusing normalization with drift, and missing audit investigation.

## Verification
A subsequent plan converges and ownership prevents recurrence.

## Expected output
Reconciled desired state with cause and prevention action.

## Stop conditions
Suspected compromise, unclear ownership, active incident work, or destructive remediation.