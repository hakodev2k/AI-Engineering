# Technical Workshop Design

## Purpose
Design hands-on workshops that produce verifiable learning outcomes across varied developer environments.

## When to use
Use for conferences, community programs, customer education, bootcamps, and launch enablement.

## Inputs
Audience baseline, learning objectives, duration, environment, exercises, facilitator capacity, platform limits.

## Context to inspect
Prerequisites, installation burden, account provisioning, accessibility, network capacity, quotas, exercise dependencies, and support staffing.

## Core knowledge
Workshops require active practice, checkpoints, progressive difficulty, recovery paths, and bounded scope. Completion should demonstrate capability, not merely copying.

## Procedure
1. Define measurable learning outcomes.
2. Create a minimal pre-work path and validation script.
3. Sequence concepts from prerequisite to independent application.
4. Design short exercises with observable checkpoints.
5. Include deliberate decision-making rather than only copy/paste.
6. Prepare starter and solution states.
7. Test provisioning, quotas, and reset paths at expected concurrency.
8. Define facilitator interventions and timing gates.
9. Pilot with representative participants.
10. Adjust pacing from observed completion distribution.
11. Provide post-workshop next steps and cleanup.

## Decision points
Use browser/cloud environments when setup variance dominates learning; local setup when environment knowledge is itself an objective. Cut breadth before sacrificing practice time.

## Common failure patterns
Long lectures, brittle setup, serial exercise dependencies, no catch-up path, hidden costs/quotas, and exercises whose success cannot be observed.

## Verification
Run a full pilot, measure completion at checkpoints, test reset/solution paths, and confirm participants can perform a transfer task without step-by-step instructions.

## Expected output
A facilitator-ready workshop with prerequisites, exercises, checkpoints, solutions, timing, recovery, and cleanup.

## Stop conditions
Stop when environment capacity is unverified, participant data/security requirements are unresolved, or core exercises cannot be completed within the allotted time.