# Admission Policy and Governance

## Purpose
Enforce cluster-wide safety, security, and operational standards at admission time without creating brittle developer friction.

## When to use
Policy-as-code, multi-team clusters, compliance controls, or recurring unsafe manifest patterns.

## Inputs
Required controls, exception model, workload patterns, policy engine capabilities, and ownership.

## Context to inspect
Admission webhooks, ValidatingAdmissionPolicy, policy engines, namespace labels, existing violations, and CI checks.

## Core knowledge
Admission is on the deployment critical path. Policies should be deterministic, observable, versioned, and safely rolled out.

## Procedure
1. Convert requirements into testable policy statements.
2. Inventory current violations.
3. Choose native admission or policy engine based on expressiveness.
4. Implement policy with clear messages.
5. Start in audit/warn mode when feasible.
6. Provide documented exceptions with expiry/owner.
7. Shift checks into CI for early feedback.
8. Enforce gradually and monitor webhook health.

## Decision points
Use native mechanisms for simple stable rules; external engines for reusable complex policy and reporting where operational cost is justified.

## Common failure patterns
Blocking production before auditing, unavailable webhooks, vague errors, permanent exceptions, and policies coupled to unstable labels.

## Verification
Policy tests cover allowed/denied cases; admission latency and availability remain acceptable.

## Expected output
Versioned enforceable policies with rollout and exception process.

## Stop conditions
Stop if a policy could block recovery workloads without a tested break-glass path.