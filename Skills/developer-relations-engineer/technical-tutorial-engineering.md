# Technical Tutorial Engineering

## Purpose
Produce tutorials that reliably teach a developer to complete a meaningful task and understand the key decisions behind it.

## When to use
Use for onboarding, new capabilities, common integrations, or recurring support questions.

## Inputs
Learning objective, target persona, supported environment, API/SDK docs, example application, expected outcome.

## Context to inspect
Prerequisite knowledge, platform versions, competing workflows, known pitfalls, accessibility needs, and existing canonical docs.

## Core knowledge
Tutorials should optimize for successful learning, not feature density. Every step must have a reason, observable result, and recovery path. Preserve conceptual continuity while avoiding unexplained magic.

## Procedure
1. Define the observable end state.
2. State prerequisites and tested versions.
3. Build the workflow yourself from a clean environment.
4. Break it into dependency-ordered steps.
5. Explain important choices at the point of use.
6. Include commands/code that can be copied safely.
7. Add checkpoints after risky transitions.
8. Cover likely errors without overwhelming the main path.
9. Link deeper reference instead of duplicating it.
10. User-test with someone matching the target audience.
11. Re-run before publication and on material releases.

## Decision points
Use a guided tutorial for learning; a how-to for known tasks; reference for exhaustive parameters. Split long tutorials when independent goals emerge.

## Common failure patterns
Unstated prerequisites, skipped steps, stale commands, unexplained code, success that cannot be observed, excessive branching, and assuming author-local configuration.

## Verification
Execute every step verbatim in a clean environment, validate output, test common failure recovery, and confirm a target developer can complete it without author assistance.

## Expected output
A tested tutorial with prerequisites, sequential procedure, checkpoints, explanations, troubleshooting, and next steps.

## Stop conditions
Stop when the workflow is unstable, requires unsupported configuration, or cannot be reproduced outside the author environment.