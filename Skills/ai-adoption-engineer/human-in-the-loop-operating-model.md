# Human-in-the-Loop Operating Model

## Purpose
Design human review, approval, correction, and escalation around AI outputs so responsibility and control match the consequences of error.

## When to use
Use when AI recommendations or actions affect customers, money, regulated decisions, production systems, or other consequential workflows.

## Inputs
Workflow map, AI capabilities, error modes, user roles, risk levels, decision rights, expected volume, latency targets, and audit requirements.

## Context to inspect
Inspect who currently owns decisions, what evidence reviewers need, exception queues, service levels, approval rules, and how mistakes are corrected downstream.

## Core knowledge
Human review is not automatically a safety control. Reviewers can become overloaded, rubber-stamp plausible outputs, or lack the context needed to detect errors. Effective oversight requires selective routing, usable evidence, and clear authority.

## Procedure
1. Classify AI outputs by consequence and reversibility.
2. Identify decisions that legally or operationally require human ownership.
3. Define confidence, policy, or anomaly triggers for review.
4. Specify what context the reviewer receives.
5. Define approve, edit, reject, defer, and escalate actions.
6. Set queue priorities and service levels.
7. Design reviewer workload limits and fallback behavior.
8. Record decisions and corrections for audit and learning.
9. Measure review rate, override rate, missed errors, and review latency.
10. Periodically recalibrate routing thresholds using observed evidence.

## Decision points
Use mandatory review for high-consequence actions. Use exception-based review where risk is lower and detection signals are reliable. Avoid human review when the reviewer cannot realistically validate the output.

## Common failure patterns
Requiring review for everything, hiding source evidence, unclear accountability, no escalation path, and assuming low override rates prove AI correctness.

## Verification
Run representative success and failure scenarios and verify the right cases are routed, reviewers have sufficient evidence, and decisions are auditable.

## Expected output
A documented review model with roles, triggers, queues, evidence requirements, SLAs, escalation, telemetry, and controls.

## Stop conditions
Stop when decision ownership, reviewer capability, or required auditability cannot be established.