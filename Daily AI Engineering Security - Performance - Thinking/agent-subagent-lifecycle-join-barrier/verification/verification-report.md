# Verification Report

## Verification model

This report separates **Implemented**, **Measured**, and **Verified** to avoid claiming evidence that does not exist.

## Implemented

The package implements:

- durable logical parent-child lifecycle contracts;
- required vs optional descendant classification;
- bounded active/stale/terminal state model;
- descendant-closure join checking, including nested children;
- blocking parent completion for active or failed required descendants;
- mandatory handoff references for successful children;
- independent verifier identity and non-empty check requirements;
- rejection of implementing-owner self-verification;
- stale-child detection based on heartbeat age;
- explicit resource-exhaustion/orphan/timeout terminal states;
- bounded retry/wait rules and headless non-zero failure semantics;
- regression tests for the primary lifecycle failure modes.

## Static verification performed in this run

- Required package files were generated with non-placeholder content.
- `scripts/join_guard.py` uses deterministic JSON state and exit codes rather than an LLM decision for join PASS/BLOCKED.
- The checker computes descendant closure, so a required grandchild cannot escape a root parent check when parent linkage is persisted.
- Required active descendants block.
- Required terminal states other than `succeeded` block.
- Required successful descendants require both a handoff reference and independent verification with `verdict: pass`.
- Self-verification by the recorded implementation owner is rejected.
- Structural validation rejects missing parent references and parent cycles.
- Stale detection is separated from the model loop and returns a distinct exit code.
- No script performs destructive filesystem/network/repository mutations.
- No secrets or credentials are embedded in package configuration.

## Runtime test execution status in this generation environment

A runtime test attempt was made by fetching the just-written public GitHub files into a local execution environment and running `python -m unittest`. The local runtime could not resolve `raw.githubusercontent.com` (`curl: (6) Could not resolve host`), so the generated test files could not be downloaded into that separate runtime for execution.

Therefore:

- **Implemented:** yes.
- **Measured in this generation environment:** package-level runtime tests not measured because the local runtime could not retrieve the GitHub files.
- **Static-verified:** yes, as listed above.
- **Runtime-verified for a consuming integration:** required before deployment; run the command below in a normal checkout.

This network limitation is not represented as a passing test result.

## Runtime verification command

From the package directory:

```bash
python -m unittest discover -s tests -p 'test_*.py' -v
```

Expected cases:

1. running required child blocks parent;
2. failed required child blocks parent;
3. resource-exhausted required child blocks parent;
4. succeeded child without readable verification blocks;
5. implementing-owner self-verification blocks;
6. independently verified successful required child passes;
7. failed optional child does not block;
8. required nested grandchild is included in descendant closure;
9. missing parent is rejected as structural error;
10. parent cycle is rejected.

## Integration-level verification

A production integration is **Verified** only when all of the following are observed under fault injection:

- parent exit cannot be success with a required active descendant;
- parent exit cannot be success with a required failed/resource-exhausted/orphaned descendant;
- parent exit cannot be success when required handoff verification is absent or failed;
- nested required descendants are included;
- stale child is detected within `stale_timeout_seconds + poll_interval_seconds`;
- global wait stops within `max_join_wait_seconds`;
- status polling does not require repeated LLM turns when deterministic runtime status is available;
- a resource-exhausted child preserves partial work when available without satisfying success;
- optional child failure is reported but does not block when configured non-blocking;
- recovery retry history is append-only and bounded.

## Metrics to collect

| Metric | Target |
|---|---:|
| required_unjoined_at_parent_success | 0 |
| required_invalid_handoffs_at_parent_success | 0 |
| silent_required_orphans | 0 |
| independent_verifier_coverage_required_success | 100% |
| unbounded_wait_loops | 0 |
| stale_detection_latency | <= stale timeout + poll interval |
| model_calls_for_status_only | 0 where deterministic status exists |
| retry_attempts_per_logical_task | <= configured maximum |

## Evidence interpretation

The public issues establish that premature parent success, missing/ambiguous subagent handoff, misrouted waits, stale subagent states, and missing parent linkage are real current failure modes. The package does not claim those products are universally broken; it treats the reports as evidence that orchestrators need an independent lifecycle invariant rather than relying solely on product-specific conversational behavior.

## Failure policy

If any required integration verification fails:

1. capture ledger plus provider status evidence;
2. do not weaken required/verification rules;
3. permit at most two implementation-fix/test iterations;
4. if the lifecycle state cannot be made authoritative, stop deployment and escalate;
5. never convert an unknown child state into success merely to unblock CI.

## Definition of Done for deployment

- Public evidence and current limitations documented.
- All package references resolve.
- Runtime unit tests pass in the consuming checkout.
- Provider adapter maps child lifecycle states and parent linkage correctly.
- Fault-injection tests prove required active/failed/unverified descendants block parent success.
- Stale/global deadlines are measured and within configured bounds.
- Independent verification covers all required successful handoffs.
- No required orphan is silently ignored.
- Safety/permission boundaries remain unchanged or stronger.
- No blocking lifecycle defect remains.
