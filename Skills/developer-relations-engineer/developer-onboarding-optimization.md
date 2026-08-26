# Developer Onboarding Optimization

## Purpose
Reduce time-to-first-value and prevent avoidable abandonment in developer onboarding.

## When to use
Use for new products, poor activation, confusing quickstarts, or significant onboarding changes.

## Inputs
Funnel analytics, docs, signup/auth flow, SDK installation, quickstart, support issues, user research.

## Context to inspect
Entry channels, prerequisites, account creation, credentials, environment setup, first API call, error states, first meaningful application, and production transition.

## Core knowledge
First success is not necessarily first value. Senior DevRel distinguishes activation milestones from vanity completion and removes unnecessary cognitive, operational, and permission friction.

## Procedure
1. Define the target developer and first meaningful value event.
2. Instrument or reconstruct the onboarding funnel.
3. Observe representative developers attempting it unaided.
4. Identify abandonment and high-effort transitions.
5. Classify friction as product, docs, tooling, permissions, conceptual, or trust-related.
6. Prioritize by impact, prevalence, and fix cost.
7. Simplify prerequisites and defaults where safe.
8. Add progressive disclosure and recovery guidance.
9. Test changes against clean accounts/environments.
10. Compare activation, completion time, and downstream retention.

## Decision points
Fix product friction at the product layer when possible; do not permanently document around a defect. Optimize defaults for common paths while preserving advanced control.

## Common failure patterns
Counting signup as activation, hiding setup complexity, adding prose instead of removing friction, optimizing only expert users, and failing to measure retention after quickstart completion.

## Verification
Validate lower median completion time, fewer dead ends, successful error recovery, and improved progression to a meaningful next action.

## Expected output
A prioritized onboarding improvement plan with baseline, interventions, experiments, and measured outcomes.

## Stop conditions
Stop when instrumentation is misleading, auth/security requirements are unclear, or simplification would weaken required controls.