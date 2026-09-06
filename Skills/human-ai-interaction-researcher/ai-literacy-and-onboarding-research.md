# AI Literacy and Onboarding Research

## Purpose
Evaluate whether onboarding gives users the practical understanding needed to use an AI system effectively, recognize limits, protect sensitive information, and recover from errors.

## When to use
Use for new AI products, major capability changes, agent permissions, high-risk workflows, or populations with varied AI familiarity.

## Inputs
Onboarding flow, capability boundaries, target users, common failures, safety guidance, task goals, and product terminology.

## Context to inspect
Inspect first-run experience, documentation, examples, disclosure language, permission prompts, error messages, support content, and observed novice behavior.

## Core knowledge
Effective AI literacy is operational: users should know what the system can do, what it may get wrong, what context it has, how to verify, and when not to delegate. Front-loading exhaustive explanations often fails due to low attention and poor timing.

## Procedure
1. Define the minimum knowledge required for safe and effective first use.
2. Identify misconceptions with high cost.
3. Observe users before instruction to establish baseline expectations.
4. Test onboarding content at the moment knowledge becomes actionable.
5. Measure comprehension through predictions and tasks rather than recall alone.
6. Evaluate examples for overpromising or teaching brittle prompting behavior.
7. Test privacy and permission understanding.
8. Examine whether users know how to verify and recover from errors.
9. Compare novice and experienced-user needs.
10. Recommend progressive disclosure and contextual education where appropriate.

## Decision points
Use upfront disclosure for critical safety or permission information; contextual education for task-specific concepts; optional depth for expert users. Do not rely on documentation to compensate for unsafe defaults.

## Common failure patterns
Feature tours without mental-model value, generic 'AI can make mistakes' warnings, overwhelming users with technical detail, assuming familiarity from prior chatbot use, and testing recall instead of behavior.

## Verification
Users should demonstrate correct expectations and safe actions in representative tasks after onboarding, including at least one failure or uncertainty scenario.

## Expected output
An onboarding assessment with required literacy outcomes, comprehension gaps, risky misconceptions, and prioritized instructional or design changes.

## Stop conditions
Stop when essential safety information is unknown, onboarding claims cannot be reconciled with actual capability, or participant exposure would require real sensitive data.