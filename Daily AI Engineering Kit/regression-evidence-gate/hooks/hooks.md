# Hooks

## PreTestDesign

**Trigger:** before adding or changing regression tests.

**Action:** verify `regression-evidence.json` exists and contains at least one required obligation.

**Command:**

```bash
python scripts/validate-evidence.py --evidence regression-evidence.json --allow-uncovered
```

**Failure behavior:** stop test design if the manifest is malformed.

## PostTestEdit

**Trigger:** after modifying test files.

**Action:** verify every evidence entry that declares coverage points to an existing test file.

**Command:**

```bash
python scripts/check-test-files.py --evidence regression-evidence.json
```

**Failure behavior:** block handoff to Verification Reviewer until references are corrected.

## PostFocusedTests

**Trigger:** after focused test execution.

**Action:** update command/result/evidence fields in the manifest, then re-run structural validation.

**Command:**

```bash
python scripts/validate-evidence.py --evidence regression-evidence.json --allow-uncovered
```

**Failure behavior:** do not claim test evidence when execution data is missing.

## PreComplete

**Trigger:** immediately before declaring the task verified.

**Action:** require strict evidence validation and file-reference validation.

**Commands:**

```bash
python scripts/check-test-files.py --evidence regression-evidence.json
python scripts/validate-evidence.py --evidence regression-evidence.json
```

Then run repository-native build/test/static checks defined by the host project.

**Failure behavior:** completion may remain `implemented`, but verification status must fail.

## Notes

These hooks are tool-neutral lifecycle definitions. Adapt their invocation to the coding agent or CI system being used. Deterministic scripts should remain the enforcement mechanism whenever possible.
