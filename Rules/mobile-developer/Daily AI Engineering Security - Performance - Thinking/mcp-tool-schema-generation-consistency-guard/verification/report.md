# Verification Report

## Security invariants
1. Candidate refresh is compiled completely before publication.
2. Failed refresh preserves the last known-good generation.
3. Every in-flight call pins generation, schema hash, validator, and task metadata before network await.
4. Response validation uses pinned metadata rather than mutable current metadata.
5. A schema-expected call without a pinned validator fails closed.
6. Retired generations remain available until in-flight leases reach zero.
7. Side-effecting calls are not blindly replayed after client-side validation faults.

## Implemented
- Research and evidence mapping for MCP SDK issues #2612 and #2614.
- Policy for failure-atomic refresh and generation-pinned validation.
- Actionable skills, enforceable rules, separated implementation/verification roles, bounded workflows, and lifecycle hooks.
- `schema_generation_guard.py` for catalog sanity checks and dispatch/validation trace consistency analysis.
- `generation_snapshot.py` for atomic generation-descriptor publication.
- Regression tests for invalid schema, generation mismatch, missing validator, concurrent refresh provenance, and atomic file output.

## Measured targets
Production integrations should record:
- `cross_generation_validation_total` = 0.
- `schema_expected_missing_validator_total` = 0.
- `partial_generation_publication_total` = 0.
- `failed_refresh_previous_generation_preserved_ratio` = 1.0.
- `output_schema_validation_coverage` = 1.0 for non-error results whose dispatch generation declares `outputSchema`.
- refresh compile/publish latency, retained generations, and live leases.

## Verification procedure
Run:

```bash
python -m unittest tests/test_schema_generation_guard.py -v
python scripts/schema_generation_guard.py validate-catalog --catalog <candidate-tools-list.json>
python scripts/schema_generation_guard.py analyze --events <client-trace.jsonl>
```

Then perform a runtime race test:
1. Publish generation G1 whose tool output requires `generation=old`.
2. Dispatch a delayed call and pin G1.
3. Publish G2 requiring `generation=new` while the call is pending.
4. Return `{generation: old}` to the pending call; it must be evaluated by G1 and pass.
5. Repeat with `{generation: invalid}`; it must fail G1 validation.
6. Inject an invalid schema into a G3 refresh; refresh must fail and G2 must remain active.
7. Confirm no request observes a partially built catalog.

## Independent-review gate
The Verification Agent must be distinct from the implementing agent for production/security-sensitive adoption. Evidence must include test output plus trace records showing generation IDs and schema hashes.

## Failure handling
- A deterministic invalid candidate is rejected without retrying unchanged input.
- Transient catalog acquisition may retry at most twice.
- If there is a valid current generation, preserve it and mark it stale when refresh fails.
- If no valid generation exists, tool execution requiring catalog metadata is blocked and escalated.
- Never resolve failures by disabling validation or mutating an in-flight request to a different generation.

## Definition of Done
- Evidence documented and linked.
- Baseline generation telemetry captured.
- Candidate publication is failure atomic.
- Dispatch-to-validation provenance is generation pinned.
- All deterministic tests pass in the target runtime.
- Runtime race/failure-injection tests pass.
- Required metrics show zero consistency violations during canary.
- No security boundary was weakened.
- Independent verification completed for release.
