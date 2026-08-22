# Verification

## Verification objective
Prove that the effective runtime permission behavior matches the approved policy matrix across relevant actors, execution surfaces, and risk boundaries.

## Implemented
The package includes:
- explicit scenario matrix format;
- deterministic comparison script;
- passing example observations;
- unit tests covering pass, unexpected allow, and missing critical scenario;
- bounded diagnosis/remediation workflows;
- parent/subagent delegation checks;
- integration and hook guidance.

Implemented does **not** mean a target agent runtime is compliant. Runtime compliance requires fresh observations from that environment.

## Measured
A target environment is considered measured only when:
1. runtime/product version is recorded;
2. active permission/sandbox/network/hook/tool configuration is recorded;
3. every required scenario has a real observation from the target environment;
4. observations are sanitized and machine-readable;
5. verifier output is retained.

## Verified
A target environment is verified only when:
- `permission_consistency_verifier.py` exits `0` with `--require-all`;
- zero security mismatches exist;
- zero required reliability mismatches exist for unattended use;
- no critical scenario has `unknown-gate` as the unexplained effective reason;
- parent/subagent pairs conform to intended inheritance semantics;
- an independent verifier reviews critical boundaries.

## Deterministic package tests
From the package root:

```bash
python -m unittest tests/test_verifier.py
```

Expected: all tests pass.

Then run the example conformance input:

```bash
python scripts/permission_consistency_verifier.py \
  --matrix config/policy-matrix.example.json \
  --observations tests/observations.example.jsonl \
  --require-all
```

Expected: exit code `0`, status `PASS`, mismatch count `0`.

## Security regression test
`tests/test_verifier.py` mutates the critical destructive-delete scenario from expected `deny` to observed `allow`. The verifier must exit `2` and report at least one security mismatch.

This demonstrates the package's core fail-closed behavior without executing a destructive command.

## Missing-evidence test
The unit test removes a critical scenario observation. The verifier must exit `2` and identify the missing scenario. This prevents a sparse test run from being mistaken for compliance.

## Metrics
Track per environment/version:
- configured scenarios;
- observed scenarios;
- missing required scenarios;
- overall mismatch count;
- security mismatch count;
- reliability mismatch count;
- unknown reason count;
- parent/subagent paired-scenario agreement;
- clean rerun stability.

## Acceptance thresholds
For unattended or sensitive use:
- security mismatch count = 0;
- missing critical scenarios = 0;
- required scenario coverage = 100%;
- unexplained critical reason count = 0;
- no unresolved unexpected asks/denies that can stall required unattended work.

## Failure handling
### Detection
Any non-zero verifier exit, unexpected allow, missing critical observation, or unexplained critical decision.

### Evidence
Preserve sanitized matrix, observations, report, runtime version, config hashes/versions, and minimal reproduction steps.

### Retry policy
- One clean-session retry when stale session state or collection error is plausible.
- Maximum two evidence-backed remediation/retest cycles.

### Fallback
Restore last verified runtime/configuration where feasible and disable the affected unattended capability.

### Escalation
Escalate to a human security/platform owner or upstream vendor/framework with minimal sanitized reproduction.

### Stop condition
Stop immediately on unexpected allow for a high/critical-risk scenario. Stop remediation after two failed cycles rather than weakening policy.

## Definition of Done
- evidence-backed problem documented;
- expected matrix reviewed;
- deterministic package tests pass;
- target runtime observations captured;
- comparison report generated;
- no blocking mismatches remain;
- independent verification complete;
- risks and any intentional platform exceptions documented;
- no secrets included in evidence artifacts.
