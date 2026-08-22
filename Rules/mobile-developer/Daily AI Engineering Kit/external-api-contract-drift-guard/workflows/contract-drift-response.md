# Workflow: Contract Drift Response

## Entry condition
A current and candidate upstream contract are available, or a provider change is suspected and snapshots can be obtained safely.

## Required inputs
- current contract;
- candidate contract;
- integration repository;
- supported provider/API versions;
- build/test commands;
- rollout constraints.

## Flow

```text
Trigger
  ↓
Normalize contracts
  ↓
Generate deterministic diff
  ↓
Contract Analyst: classify + map consumers
  ↓
Enough evidence?
  ├─ No → remap (max 2 attempts) → still missing? STOP
  └─ Yes
       ↓
Build compatibility plan
       ↓
Approval required?
  ├─ Yes → Human approval → rejected? STOP
  └─ No/approved
       ↓
Implement smallest safe adapter/client change
       ↓
Run targeted contract + regression tests
       ↓
Failure?
  ├─ transient evidence → retry max 2
  ├─ deterministic/product failure → diagnose/fix max 2 cycles
  └─ pass
       ↓
Compatibility Verifier
       ↓
Verified?
  ├─ No → return exact gaps; max 1 implementation rework cycle
  ├─ Blocked → STOP
  └─ Yes → COMPLETE
```

## Stages and ownership

1. **Snapshot/normalize** — deterministic scripts.
   - Artifact: normalized current/candidate contracts.
   - Checkpoint: both parse and are secret-free.
2. **Diff** — `diff-contracts.py`.
   - Artifact: `contract-drift-report.json`.
3. **Semantic analysis** — Contract Analyst + `analyze-contract-drift.md`.
   - Artifact: drift assessment.
4. **Planning** — primary agent + `build-compatibility-plan.md`.
   - Artifact: compatibility plan.
5. **Approval gate** — human when required.
6. **Implementation** — primary implementation agent.
   - Constraint: stay within approved plan or stop when scope expands materially.
7. **Testing** — project-native build/contract/regression tests.
8. **Independent verification** — Compatibility Verifier.
9. **Completion** — only after verified status.

## Human approval points
Mandatory for production auth/config, breaking public contracts, destructive migrations, infrastructure changes, or broad major dependency upgrades.

## Retry rules
- Snapshot/normalization environmental error: one retry.
- Consumer mapping: maximum two additional search passes.
- Transient tests: maximum two retries.
- Implementation diagnose/fix/test: maximum two cycles for the same failure class.
- Verification rework: maximum one return to implementation before escalation.

## Stop conditions
Stop when required contract input is invalid/unavailable, a breaking item remains unmapped, approval is missing/rejected, the same deterministic failure persists after retry budget, or scope expands beyond the approved plan.

## Definition of Done
- deterministic diff generated;
- every high-risk item dispositioned;
- consumers mapped with evidence;
- compatibility plan executed;
- required approvals recorded;
- build/tests pass;
- independent verifier returns `verified`;
- residual risks are documented.
