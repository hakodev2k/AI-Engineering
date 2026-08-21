# Flaky Test Hooks

Hooks are tool-neutral lifecycle rules. Adapt the commands to the repository's test runner while preserving the failure behavior.

## PreRerun — preserve the original failure

**Trigger:** Before any retry of a failed test.

**Action:** Preserve the original JUnit/log/screenshot/video artifact under a unique run path and record the test/commit/run identity.

**Command/script:** Repository-specific copy/archive command. No LLM is required.

**Failure behavior:** If preservation fails, stop the rerun unless a human explicitly accepts the evidence loss. Do not overwrite the first failure.

## PostDiagnosticRuns — aggregate all observations

**Trigger:** After the original run plus bounded diagnostic reruns complete.

**Action:** Aggregate all JUnit XML observations and normalized failure signatures.

**Command:**

```bash
python scripts/aggregate-junit.py --input "artifacts/test-runs/*.xml" --output artifacts/flaky-summary.json
```

**Failure behavior:** Retry once only for a clearly transient artifact-transfer problem. Otherwise stop triage and report the aggregation error.

## PreQuarantine — validate decision prerequisites

**Trigger:** Before adding a test to the quarantine registry.

**Action:** Confirm triage classification is not `product-regression` or `unknown`, evidence meets minimum observations, and required reviewer/human approval exists.

**Command/script:** Semantic review according to `skills/quarantine-decision.md`; do not automate this judgment with a permissive default.

**Failure behavior:** Block quarantine and return to investigation/review.

## PostRegistryEdit — validate quarantine registry

**Trigger:** After any quarantine registry edit.

**Action:** Validate structure, classifications, expiry, ownership, evidence, critical-path approval, and policy horizon.

**Command:**

```bash
python scripts/validate-quarantine.py --registry test-quarantine.json --policy config/flaky-test-policy.json
```

**Failure behavior:** Fail the gate. Do not auto-extend dates, invent approvals, or delete entries to obtain a pass.

## PreComplete — verify no retry-until-green outcome

**Trigger:** Before declaring the task verified.

**Action:** Check that the final report references the initial failure plus all diagnostic observations; verify the passing retry did not replace the original evidence.

**Command/script:** Review `artifacts/flaky-summary.json`, triage report, and registry validation result.

**Failure behavior:** Mark the task `completed but not verified` until missing evidence is restored or the limitation is explicitly escalated.

## ExpiryGate — block stale quarantine

**Trigger:** CI/review run containing a quarantine registry.

**Action:** Run `validate-quarantine.py` using the current date.

**Failure behavior:** Expired entries fail the gate. Renewal requires fresh evidence and approval; never extend automatically.
