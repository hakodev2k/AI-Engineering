# Schema Drift Gate Workflow

## Trigger
Run when a change may alter structured LLM output: prompt/model changes, tool/function schemas, response-format schemas, parser changes, agent handoff contracts, or contract-related dependencies.

## Entry conditions
- Baseline schema exists and represents accepted behavior.
- Candidate schema can be generated or supplied.
- Affected consumers are identifiable.

## Inputs
Baseline schema, candidate schema, optional output samples, changed files, consumer tests, and approval record if an intentional breaking change is planned.

## Flow

```text
Trigger
  ↓
Baseline Review — Contract Reviewer
  ↓
Deterministic Schema Comparison
  ↓
Consumer Impact Review
  ↓
[block?] ── yes → Remediate or request approval
  │                    ↓
  │              max 2 attempts
  │                    ↓
  └──────────────→ Independent Verification
                         ↓
                     Complete
```

## Stages
1. **Context** — Contract Reviewer locates producer, consumers, parser behavior, tests, and fixtures.
2. **Baseline** — execute `skills/contract-baseline-review.md`.
3. **Gate** — run `python scripts/schema_drift_gate.py --baseline <baseline> --candidate <candidate> --samples <samples> --out schema-drift-result.json` when samples exist; omit `--samples` otherwise.
4. **Impact** — map findings to consumer behavior. `field_removed`, `required_added`, `type_changed`, `enum_narrowed`, invalid samples, and validator/tool errors block completion.
5. **Remediation** — execute `skills/drift-remediation.md`. Maximum two attempts. Preserve every gate result and test output.
6. **Approval** — for intentional breaking changes, fill `templates/change-approval.md` and stop until a human explicitly approves coordinated consumer migration.
7. **Verification** — Verification Agent independently reruns gate and affected tests, checks diff and approval evidence.

## Checkpoints
- Baseline evidence accepted before candidate evaluation.
- Breaking findings require remediation or approval; they cannot be downgraded by the implementing agent.
- Verification is separate from implementation.

## Retry rules
- Remediation: maximum 2 attempts.
- Transient tool/environment failure: maximum 1 retry.
- Validation, permission, approval, or business-rule failures: no automatic retry.
- Preserve failing schema, gate output, and test logs on every attempt.

## Failure paths
- Missing authoritative baseline → stop and escalate.
- Invalid candidate schema → block.
- Missing validator dependency for requested sample validation → block and install/configure dependency; do not skip validation.
- Permission/approval failure → stop.
- Two failed remediations → escalate with evidence.

## Approval points
Human approval is required before intentionally breaking a public or cross-agent contract, weakening validation, changing security-sensitive fields, or coordinating irreversible consumer/data migrations.

## Produced artifacts
Baseline/candidate schemas, `schema-drift-result.json`, test output, optional approval record, and verification result.

## Definition of Done
- Baseline and candidate are identified.
- Gate is non-blocking.
- Representative outputs validate when supplied.
- Affected parser/contract/integration tests pass.
- Independent verification completed.
- Required approval exists for intentional breaking change.
- Remaining risks are documented and no blocking failure remains.
