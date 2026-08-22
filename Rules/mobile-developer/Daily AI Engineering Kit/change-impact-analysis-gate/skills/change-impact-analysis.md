# Skill: Change Impact Analysis

## Purpose
Map the likely blast radius of a proposed code change before implementation begins.

## When to use
Use for any non-trivial change that may cross module, contract, persistence, integration, background-processing, security, configuration, deployment, or test boundaries.

## Inputs
- Change request or bug description
- Repository source
- Existing tests
- Build/dependency metadata
- Optional architecture or API documentation

## Preconditions
- Repository can be read.
- The requested change is understood well enough to identify at least one entry point or owning component.
- No implementation edits have started for the current change.

## Process
1. Restate the requested behavior change in one precise sentence.
2. Identify the primary entry point: endpoint, command, handler, job, UI action, event consumer, library API, or scheduled process.
3. Trace direct callers and callees from that entry point.
4. Identify all state reads and writes, including database, cache, filesystem, queue, external API, and in-memory shared state.
5. Identify contract surfaces: HTTP schema, public methods, events/messages, database schema, configuration keys, serialization formats, CLI arguments, package APIs.
6. Identify operational surfaces: logging, metrics, retries, timeouts, alerts, feature flags, permissions, deployment config.
7. Locate existing tests that exercise the current behavior.
8. Identify likely regression zones and negative-path behavior.
9. Record every candidate affected component with concrete evidence: file path, symbol, test, schema, configuration, or call path.
10. Classify each candidate as `direct`, `indirect`, or `uncertain` impact.
11. Define expected implementation files and supporting files likely to change.
12. Define the minimum test/build/contract checks required after implementation.
13. Record unresolved questions separately from confirmed impact.
14. Produce `impact-manifest.json` conforming to the provided schema.

## Tools it may use
- Repository text/code search
- Symbol/reference navigation
- Git history and blame for context
- Existing test runner in read-only discovery mode
- Build/dependency inspection commands that do not modify the repository

## Constraints
- Do not edit source files while performing this skill.
- Do not infer “no impact” from absence of search results alone.
- Do not mark a component as affected without evidence or an explicit uncertainty note.
- Do not silently broaden the requested behavior beyond the user’s task.

## Expected output
A complete impact manifest containing request summary, entry points, affected components, contracts, state changes, expected files, required verification, risk level, approvals, and unresolved questions.

## Verification
The analysis is acceptable only when:
- at least one concrete entry point is identified;
- all obvious state/contract surfaces on the traced path are addressed;
- test coverage implications are listed;
- every affected component has evidence;
- uncertain areas are explicit rather than hidden.

## Failure handling
- If repository search is incomplete, retry with narrower symbols and alternate navigation paths, maximum two additional attempts.
- If entry points remain unknown, stop and report insufficient evidence.
- If a dependency or generated artifact cannot be inspected, mark it `uncertain` and require reviewer attention.

## Stop conditions
Stop when either:
- the impact manifest is complete enough for independent review; or
- critical evidence cannot be obtained after bounded retries.
