# Skill: Working-Set Audit

## Purpose
Build and validate the minimum repository working set required for a concrete edit without discarding correctness-critical facts.

## Trigger
Run before implementation, before a material edit batch, after dependency/config/test changes, and before compaction.

## Inputs
Task goal, planned files, acceptance criteria, repository search results, current context inventory, file hashes, token/byte estimates.

## Preconditions
The task and intended edit scope are explicit enough to identify dependencies. Repository reads are non-destructive.

## Allowed tools
Repository search/read, dependency inspection, test discovery, hashing, token/byte accounting, static analysis.

## Constraints
- Do not infer a required fact from memory when repository evidence is available.
- Do not remove a fact solely to meet a token target if an edit depends on it.
- Keep evidence references when raw content is evicted.

## Procedure
1. Decompose the intended change into edit units.
2. For each edit unit, list coupled facts: API contracts, imports, tests, configuration, schemas, migrations, conventions, build rules.
3. Resolve each fact to repository evidence and record source path plus content hash/version.
4. Mark facts `required`, `supporting`, or `discardable`.
5. Compute required-fact coverage and duplicate context ratio.
6. Evict duplicate exploration transcripts and irrelevant outputs first.
7. If a required fact is missing/stale, block editing and refresh it.
8. Re-run the guard after refresh. Maximum refresh retries: policy value, normally 2.
9. Emit a compact working-set manifest and verification status.

## Decision points
- Required fact missing/stale: block and refresh.
- Context over budget with 100% required coverage: evict supporting/discardable material.
- Still over budget after safe eviction: split the edit or use recoverable references; do not silently drop required facts.

## Expected output
Facts, provenance, hashes, coverage, duplicate ratio, context bytes/tokens, missing/stale items, allow/block decision.

## Metrics
Required-fact coverage, duplicate ratio, input tokens/task, repository rereads, test pass rate, regression rate.

## Verification
A separate verifier confirms every planned edit has its required facts available and fresh, then checks the post-change tests.

## Failure handling
Capture missing dependency evidence, retry discovery at most twice, then stop and escalate with the unresolved fact list.

## Stop conditions
100% required-fact coverage and policy-compliant context, or bounded retries exhausted.