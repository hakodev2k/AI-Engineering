# EF Core Query Shape Regression Gate Workflow

```text
Trigger -> Context -> Scan -> Investigate -> Remediate -> Build/Test -> Verify -> Complete
                      | blocked/inconclusive ---------------------> Stop/Escalate
```

## Trigger
An EF Core-related code change, PR, performance regression, or production investigation touches LINQ query construction, includes, materialization, persistence loops, or async database access.

## Entry conditions
Repository is available, target query path is identifiable, policy exists, and tests/build commands can be executed or their absence documented.

## Inputs
Repository root, changed files, acceptance criteria, symptoms/metrics, `config/policy.yaml`.

## Stages
1. **Context — Query Investigator:** locate entry point, DbContext, entity configuration, navigations, tests, and nearby query implementations.
2. **Static Scan — deterministic script:** run `python scripts/scan_ef_queries.py --root <repo> --policy config/policy.yaml --output ef-query-scan.json`.
3. **Investigation — Query Investigator:** classify findings and collect generated SQL/runtime evidence for confirmed risks.
4. **Plan:** select the smallest behavior-preserving remediation and identify approval boundaries.
5. **Execute — implementation owner:** apply one remediation at a time using `skills/query-regression-remediation.md`.
6. **Checkpoint:** build and targeted tests must pass; rerun scanner.
7. **Independent Verify — Query Verifier:** validate semantics and compare before/after evidence.
8. **Complete:** return verified status, evidence, and residual risk.

## Produced artifacts
`ef-query-scan.json`, investigation notes, before/after SQL or metrics when available, test/build evidence, verification result.

## Retry rules
- Scanner/tool transient failure: retry once unchanged.
- Build/test transient environment failure: retry once.
- Remediation attempt: maximum two per finding; preserve failed evidence.
- Translation/semantic failure: do not keep broadening the change; stop after two attempts and escalate.

## Approval points
Human approval is required before production index/schema changes, global query-filter removal, production configuration changes, breaking API changes, or unproven tracking-mode changes on write paths.

## Failure paths
Unknown entry point -> stop as inconclusive. Security/tenant semantics unclear -> stop. Build/test failure after two bounded remediation attempts -> restore last safe state or escalate. Scanner finding cannot be supported by runtime/code evidence -> mark false positive or inconclusive, not confirmed.

## Definition of Done
Relevant path/context identified; scanner executed; findings classified with evidence; approved boundaries respected; final code builds; targeted tests pass; final scan reviewed; independent verifier confirms functional semantics and claimed query-shape improvement; remaining risks documented.
