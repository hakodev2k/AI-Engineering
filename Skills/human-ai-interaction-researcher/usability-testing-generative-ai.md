# Usability Testing Generative AI

## Purpose
Evaluate whether users can direct, interpret, refine, verify, and recover from generative AI under realistic task conditions.

## When to use
Use for assistants, copilots, generative editors, search assistants, and agent workflows.

## Inputs
Product or prototype, target tasks, user segments, research questions, system configuration, evaluation criteria, and known risks.

## Context to inspect
Inspect prompting, history, memory, citations, editing, undo, feedback, errors, latency, model configuration, and safety constraints.

## Core knowledge
Generative AI adds output variability, uncertain correctness, conversational repair, expectation calibration, verification cost, and stochastic failures to conventional usability concerns. One successful run is weak evidence.

## Procedure
1. Define realistic tasks with observable success criteria.
2. Record system configuration and material dependencies.
3. Decide how stochastic outputs will be handled analytically.
4. Recruit users with relevant task expertise and varied AI familiarity.
5. Give goals rather than scripted interaction steps.
6. Observe prompting, interpretation, refinement, verification, and recovery.
7. Record outputs and interaction state needed to reconstruct sessions.
8. Probe reasoning after critical actions without dominating the session.
9. Capture success, effort, errors, corrections, abandonment, and confidence.
10. Repeat important scenarios when variability could alter conclusions.
11. Classify failures as interface, model, expectation, or workflow failures.
12. Prioritize findings by impact, frequency, recoverability, and risk.

## Decision points
Use live models for ecological validity. Use controlled outputs when comparing interfaces and model variability would swamp the effect. Do not over-control studies intended to understand real-world variability.

## Common failure patterns
Testing only happy paths, equating output quality with usability, changing models mid-study, teaching prompt recipes that mask discoverability problems, and reporting anecdotes without task evidence.

## Verification
Reconstruct sessions from captured context, confirm findings recur or are sufficiently consequential, and verify fixes through follow-up testing rather than implementation status alone.

## Expected output
Prioritized usability findings with evidence, failure class, severity, affected tasks, implications, and uncertainty.

## Stop conditions
Stop when model changes invalidate comparison, participant data cannot be safely captured, or task success cannot be meaningfully defined.