# Skill: Flaky Test Triage

## Purpose
Determine whether an unstable test failure is a reproducible product regression, test nondeterminism, shared-state leak, timing/race issue, external-dependency problem, infrastructure issue, environment mismatch, or still unknown.

## When to use
Use after a test failure that is intermittent, disappears on rerun, changes signature between runs, or is suspected to be flaky.

## Inputs
- Original failing test identifier.
- First-failure logs and JUnit result.
- Bounded rerun results.
- Relevant test and production code.
- Recent diff or commit context.
- Environment/runtime details when available.
- Existing quarantine registry entries.

## Preconditions
- Preserve the first failure before rerunning.
- Know the configured rerun budget.
- Do not modify production code merely to make the test pass before classification.

## Process
1. Identify the exact test and its behavioral contract.
2. Confirm whether the original failure is reproducible under equivalent conditions.
3. Run at most the configured diagnostic reruns; record every outcome.
4. Compare failure signatures, stack traces, timing, order, worker, seed, environment, and external dependency state.
5. Trace all mutable state used by the test: database, static/singleton state, filesystem, clock, random generator, cache, queue, shared fixtures, ports, browser/session, environment variables.
6. Identify concurrency and timing assumptions: sleeps, polling, eventual consistency, asynchronous callbacks, race windows, deadlines, cancellation.
7. Identify external dependencies and whether failures correlate with network/service availability.
8. Compare the failure against recent code changes and neighboring tests.
9. Form no more than three ranked hypotheses.
10. For each hypothesis, define one discriminating check that could falsify it.
11. Execute at most two investigation cycles. Do not continuously rerun until a preferred answer appears.
12. Classify the outcome as one of:
   - `product-regression`
   - `test-nondeterminism`
   - `shared-state`
   - `timing-race`
   - `external-dependency`
   - `infrastructure`
   - `environment`
   - `unknown`
13. Record evidence for and against the selected classification.
14. Decide whether the failure remains blocking or may proceed to the quarantine-decision skill.

## Allowed tools
- Repository/file search and read.
- Git diff/history inspection.
- Test runner commands.
- JUnit aggregation script.
- Logs and CI artifacts.
- Read-only database/log queries when authorized.

## Constraints
- MUST keep all observed failures in evidence.
- MUST NOT treat a passing retry as proof that production behavior is correct.
- MUST NOT exceed the configured rerun budget without explicit human approval.
- MUST NOT quarantine `product-regression` or `unknown`.
- SHOULD prefer discriminating experiments over repeated identical reruns.

## Expected output
A triage report containing:
- test identifier;
- observed runs and outcomes;
- failure signatures;
- selected classification and confidence;
- hypotheses considered;
- evidence for/against each material hypothesis;
- likely trigger or dependency;
- recommended next action;
- whether quarantine evaluation is permitted.

## Verification
The classification is verified only when the recorded evidence distinguishes it from a reproducible product regression with reasonable confidence. If evidence is ambiguous, return `unknown`.

## Failure handling
- Missing first-failure evidence: continue only if enough independent evidence remains; lower confidence explicitly.
- Test cannot be rerun: analyze available artifacts, but do not invent stability evidence.
- Different failures across reruns: preserve all signatures and increase uncertainty.
- Same deterministic failure on every observation: reclassify as reproducible rather than flaky.

## Stop conditions
Stop when:
- a reproducible regression is established;
- a supported non-product classification is established;
- two investigation cycles are exhausted without sufficient evidence;
- a dangerous production/security/data-loss condition is suspected;
- required access or evidence is unavailable.
