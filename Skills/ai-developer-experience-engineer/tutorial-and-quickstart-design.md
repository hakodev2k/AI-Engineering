# Tutorial and Quickstart Design

## Purpose
Design tutorials and quickstarts that move developers from zero context to a verified success while teaching the minimum concepts needed to extend the solution safely.

## When to use
Use for first-run guides, new SDKs, major platform capabilities, and adoption-critical workflows.

## Inputs
Target persona, prerequisite knowledge, supported runtimes, API/SDK surface, authentication, example use case, expected output, and production caveats.

## Context to inspect
Inspect existing onboarding steps, sample repositories, setup failure data, package versions, account requirements, rate limits, and common misconceptions.

## Core knowledge
A quickstart optimizes for first verified success; a tutorial additionally teaches a coherent mental model. Both must be executable, versioned, and honest about what is simplified. Copy-paste success without comprehension often creates later production failures.

## Procedure
1. Define the exact successful end state.
2. Minimize prerequisites and state them before step one.
3. Start from a clean environment and use current package versions.
4. Provide one canonical setup path before alternatives.
5. Make authentication and configuration explicit.
6. Use a small but realistic example that exercises the core capability.
7. Add checks after each meaningful step so failure is localized.
8. Explain only the concepts necessary to understand the next action.
9. Surface cost, data, latency, and safety implications before relevant calls.
10. End with verification of output and a short explanation of what happened.
11. Link to deeper guides for production concerns.
12. Continuously test the tutorial in CI or scripted smoke tests.

## Decision points
Use hosted playgrounds when setup cost blocks learning; use local examples when developers must understand files, dependencies, or runtime behavior. Prefer one blessed path over many equivalent variants in a first-run guide.

## Common failure patterns
Missing prerequisites, stale package commands, unexplained placeholders, environment-specific assumptions, success that cannot be verified, examples with unsafe defaults, and introducing optional complexity too early.

## Verification
Execute from a clean environment without undocumented knowledge, verify every command and expected output, test likely error states, and measure completion rate and time-to-first-success.

## Expected output
A tested quickstart or tutorial with prerequisites, commands, code, verification checkpoints, troubleshooting links, and next steps.

## Stop conditions
Stop when required credentials cannot be safely obtained, the example depends on unstable APIs, or platform behavior differs across environments without a defined supported path.