# Workflow: Regression Evidence Gate

## Entry condition

A non-trivial implementation, refactor, or bug fix is ready for regression verification.

## Required inputs

- task/acceptance criteria;
- implementation diff or planned change;
- repository test conventions;
- relevant contracts and existing tests.

## Stages

### 1. Behavior discovery — Owner: primary agent

Trace changed behavior, state mutations, error paths, contracts, and dependencies.

Artifact: behavior notes.

Checkpoint: changed behavior can be stated without referring only to implementation details.

### 2. Obligation mapping — Owner: primary agent

Run `skills/behavior-to-test-obligations.md` and create `regression-evidence.json`.

Artifact: obligation matrix.

Checkpoint: every material behavior has a required obligation or evidence-backed exclusion.

### 3. Test design — Owner: Test Designer

Inspect existing tests, choose test tiers, and add only missing tests.

Artifact: test changes plus evidence mappings.

Checkpoint: all testable required obligations have a test reference.

### 4. Focused execution — Owner: Test Designer

Run the narrowest relevant tests first. Record command/result.

Failure loop:

```text
Run focused tests
   ↓
Failure?
 ├─ No → Independent review
 └─ Yes → Classify failure
            ↓
        Fix justified issue
            ↓
        Rerun (max 2 fix cycles)
```

Stop after two fix cycles for the same deterministic failure.

### 5. Independent review — Owner: Verification Reviewer

Challenge obligation completeness and evidence quality.

Outcomes:

- `pass` → deterministic validation;
- `needs-evidence` → Test Designer, maximum 2 review cycles;
- `needs-human-approval` → stop for human decision.

### 6. Deterministic validation — Owner: scripts

Run:

```bash
python scripts/check-test-files.py --evidence regression-evidence.json
python scripts/validate-evidence.py --evidence regression-evidence.json
```

Checkpoint: both commands exit 0.

### 7. Broader regression — Owner: primary agent

Run repository-appropriate build, static checks, and broader relevant suites.

Artifact: verification commands and results.

### 8. Final verification — Owner: Verification Reviewer

Confirm:

- required obligations are covered;
- high-risk gaps are absent or explicitly approved;
- all referenced files exist;
- focused tests passed;
- broader required checks passed;
- unresolved risks are reported.

## Human approval points

Approval is required before:

- weakening security or authorization expectations;
- changing a public contract to make tests pass;
- schema migration or destructive database action;
- deleting or disabling existing regression protections;
- production configuration/infrastructure changes.

## Retry rules

- Transient/environmental command failure: retry at most twice.
- Test-design/review cycle: at most two returns from Reviewer to Test Designer.
- Same deterministic failure after two justified fix cycles: stop.

## Stop conditions

Stop immediately when:

- required repository context cannot be established;
- dangerous action lacks approval;
- high-risk obligation remains unproven after bounded retries;
- deterministic manifest validation fails and cannot be corrected from available evidence.

## Definition of Done

Implementation may be marked **completed** once code and tests are written.

It may be marked **verified** only when deterministic evidence checks pass, required tests/checks pass, the independent reviewer returns `pass`, and no unapproved high-risk gaps remain.
