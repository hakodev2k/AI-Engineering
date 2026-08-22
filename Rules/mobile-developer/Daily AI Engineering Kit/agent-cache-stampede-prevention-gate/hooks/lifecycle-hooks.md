# Lifecycle Hooks

## Pre-task scan
**Trigger:** before stampede analysis. **Preconditions:** repository readable. **Action:** `python3 scripts/scan-cache-stampede.py <repo> --output scan.json`. **Expected:** JSON report; exit 0 no heuristic hits, exit 1 findings need review, exit 2 invocation/input error. **Blocking:** only exit 2 blocks context collection.

## Baseline simulation
**Trigger:** before implementing mitigation when a synthetic demonstration is useful. **Preconditions:** Python available. **Action:** `python3 scripts/simulate-stampede.py --clients 32 --latency-ms 150 --output simulation.json`. **Expected:** unprotected backend call count is greater than protected single-flight call count; protected count equals one in the simulator. **Blocking:** no; repository-specific behavior still requires tests.

## Post-edit focused verification
**Trigger:** after cache-regeneration changes. **Preconditions:** project test/build/load command known. **Action:** run concurrent-miss, expiry, and backend-failure tests, then build/static checks. **Expected:** intended regeneration bound holds and build passes. **Failure:** preserve output and test parameters; diagnose before retry; maximum two transient reruns. **Blocking:** yes.

## Final assessment validation
**Trigger:** before completion. **Preconditions:** assessment JSON exists. **Action:** `python3 scripts/validate-assessment.py assessment.json`. **Expected:** `assessment valid`. **Failure:** fix contract mismatch; never mark pass while validation fails. **Blocking:** yes.
