# Developer Feedback and Support Loop

## Purpose
Turn developer feedback, support incidents, and adoption signals into prioritized DX improvements with measurable closure instead of accumulating anecdotal requests.

## When to use
Use when triaging support trends, planning DX roadmaps, evaluating new tooling, or investigating adoption friction.

## Inputs
Support tickets, forum discussions, issue trackers, surveys, interviews, usage analytics, churn or abandonment signals, error telemetry, and roadmap constraints.

## Context to inspect
Inspect recurring questions, ticket resolution time, duplicate issues, onboarding drop-offs, error-code frequency, SDK usage, documentation searches, and recent platform changes. Separate requests from underlying jobs and failure causes.

## Core knowledge
Developers often report symptoms rather than root causes. Feedback should be triangulated with behavior and telemetry. High-volume issues are not always highest impact; severe production blockers affecting fewer users can deserve priority. Closing the loop requires communicating outcomes and measuring whether friction actually declined.

## Procedure
1. Normalize incoming feedback into a common taxonomy.
2. Group duplicates by underlying developer job and failure mode.
3. Attach evidence such as frequency, severity, affected segment, and workaround cost.
4. Reproduce representative issues where possible.
5. Identify whether the root cause belongs in product, API, SDK, docs, tooling, reliability, or policy.
6. Prioritize by developer impact, strategic importance, risk, and remediation cost.
7. Define a measurable success condition for each intervention.
8. Route work to the correct owner with reproducible evidence.
9. Communicate workarounds and final fixes through appropriate developer channels.
10. Re-measure ticket volume, completion rate, or error frequency after release.
11. Feed unresolved systemic patterns into platform design reviews.

## Decision points
Fix the product or tooling when many developers independently fail at the same step. Improve documentation when behavior is correct but difficult to discover. Escalate reliability defects rather than normalizing them as documentation problems.

## Common failure patterns
Prioritizing loud users only, counting feature requests without understanding jobs, treating documentation as a patch for poor API design, closing tickets without measuring recurrence, and collecting feedback with no ownership.

## Verification
Confirm representative issues are reproducible, interventions have owners and success metrics, and post-release evidence shows reduced friction or explains why the hypothesis was wrong.

## Expected output
A prioritized evidence-backed DX backlog with root-cause categories, owners, success criteria, and closed-loop results.

## Stop conditions
Stop when evidence contains sensitive customer data that cannot be processed under policy, ownership cannot be established, or the requested change conflicts with security or contractual constraints.