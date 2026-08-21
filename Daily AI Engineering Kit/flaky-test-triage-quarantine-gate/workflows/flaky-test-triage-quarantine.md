# Workflow: Flaky Test Triage & Quarantine

## Entry condition
A test is suspected to be flaky because it fails intermittently, changes failure signature, or passes after an initial failure.

## Required inputs
- Test identifier and expected behavior.
- Original failing artifact/log/JUnit result.
- Repository test command.
- `config/flaky-test-policy.json`.
- Relevant code/diff/environment context.
- Quarantine registry path if the repository uses quarantine.

## Stages

### 1. Preserve evidence
**Responsible:** Orchestrator / deterministic hook.

- Copy or retain the first failing artifact under a unique run identifier.
- Record commit SHA, environment, runner, seed/order information when available.

**Artifact:** first-failure evidence bundle.

**Checkpoint:** no rerun begins until first-failure evidence is preserved.

### 2. Bounded diagnostic reruns
**Responsible:** Orchestrator.

- Execute no more than `max_reruns` additional runs under equivalent conditions.
- Store each result separately.
- Stop early if the same deterministic failure repeats strongly enough to establish reproducibility.

**Artifact:** JUnit/log set for all observations.

### 3. Aggregate results
**Responsible:** deterministic script.

Run:

```bash
python scripts/aggregate-junit.py --input "artifacts/test-runs/*.xml" --output artifacts/flaky-summary.json
```

**Artifact:** `flaky-summary.json`.

**Checkpoint:** aggregation must succeed before semantic classification.

### 4. Investigate
**Responsible:** Flakiness Investigator.

Apply `skills/flaky-test-triage.md`.

**Artifact:** triage report.

Decision:
- `product-regression` → remain blocking; route to defect fixing.
- `unknown` → stop and escalate; no quarantine.
- supported allowed non-product classification → proceed to quarantine evaluation if temporary isolation is necessary.

### 5. Prefer repair before quarantine
**Responsible:** Task owner / implementation agent.

When a small, well-supported fix exists, repair the source of nondeterminism first and rerun verification. Quarantine is not mandatory merely because it is allowed.

Any fix that changes database schema, production configuration, infrastructure, secrets, security controls, or public API behavior requires explicit human approval before execution.

### 6. Quarantine evaluation
**Responsible:** Quarantine Reviewer.

Apply `skills/quarantine-decision.md`.

The reviewer checks:
- allowed classification;
- minimum observations;
- evidence quality;
- owner and issue reference;
- critical-path/coverage impact;
- proposed expiry;
- required human approval.

**Artifact:** review decision.

### 7. Human approval checkpoint
Required if:
- `critical_path: true` and policy requires approval;
- quarantine removes the only automated coverage of a critical behavior;
- quarantine scope is broader than one specifically evidenced test;
- requested duration exceeds policy.

No approval may be inferred from silence.

### 8. Registry update and deterministic validation
**Responsible:** Orchestrator after approval.

Update the repository quarantine registry, then run:

```bash
python scripts/validate-quarantine.py --registry test-quarantine.json --policy config/flaky-test-policy.json
```

**Checkpoint:** validation exit code must be 0.

### 9. CI treatment
**Responsible:** Repository-specific CI adapter.

The repository may use its native mechanism to isolate the test, but it MUST:
- keep quarantined execution/failure visible;
- avoid counting quarantine as ordinary verified success;
- fail the quarantine gate on expired/invalid registry metadata.

### 10. Repair and revalidation
**Responsible:** Implementation/Test agent.

Before quarantine removal:
1. implement the smallest supported fix;
2. run the affected test repeatedly under representative conditions;
3. run neighboring/regression tests;
4. review the diff;
5. verify no new nondeterminism was introduced.

### 11. Remove quarantine
**Responsible:** Orchestrator / reviewer.

Remove the registry entry only after stability evidence is recorded. Validate the registry again.

## Retry rules
- Diagnostic reruns: maximum from policy; default 2 after the original failure.
- Investigation hypothesis cycles: maximum 2.
- Operational artifact/parser failure: retry at most once if clearly transient.
- Same semantic failure after the bounded cycle: stop and report evidence.
- Never use `retry until successful`.

## Failure scenarios

| Failure | Detection | Retry | Fallback / escalation | Stop condition |
|---|---|---|---|---|
| JUnit artifact missing | aggregation reports no matching files | once if artifact transfer was interrupted | recover artifact or report missing evidence | artifact remains unavailable |
| Different signatures across runs | aggregation/triage | no blind extra reruns | investigate multiple hypotheses | two investigation cycles exhausted |
| Reproducible product defect | same supported behavior failure | none as flakiness workflow | route to normal defect fix | classification established |
| Unknown cause | insufficient discriminating evidence | bounded investigation only | escalate with evidence | cycle budget exhausted |
| Registry invalid | validator non-zero | fix metadata, not by inventing values | obtain owner/approval/evidence | unresolved validation error |
| Quarantine expired | validator reports expiry | no automatic extension | repair or obtain fresh explicitly approved renewal | no valid renewal |

## Definition of Done
The workflow is **completed** when a triage/fix/quarantine decision exists.

The workflow is **verified** only when:
- all observations are preserved and aggregated;
- rerun/investigation budgets were respected;
- classification is evidence-backed;
- `product-regression` and `unknown` were not quarantined;
- any quarantine is independently reviewed;
- required human approval exists;
- registry validation succeeds;
- quarantined failure remains visible;
- unresolved risks are explicitly documented.
