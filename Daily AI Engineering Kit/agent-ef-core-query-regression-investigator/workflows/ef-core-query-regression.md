# Workflow: EF Core Query Regression Investigation

## Trigger
Use when an EF Core-backed operation becomes materially slower, times out, performs extra queries, or produces a worse execution plan after a code/model/provider/database change.

## Entry conditions
- Target operation and repository are identifiable.
- Read-only investigation is allowed.
- Production-impacting changes are not pre-authorized implicitly.

## Inputs
Issue/symptom, repository path, reproduction data or workload shape, baseline if known, acceptance criteria.

## Stages

### 1. Repository context
**Owner:** Query Investigator  
Locate entry point, query construction, DbContext/model configuration, tests, package versions, and recent related changes.

**Checkpoint:** Relevant query path and test surface identified.

### 2. Evidence capture
**Owner:** Query Investigator  
Execute `skills/collect-query-evidence.md`. Capture generated SQL and performance/plan evidence.

**Checkpoint:** Investigation report has facts and ranked hypotheses.

### 3. Hypothesis experiment
**Owner:** Query Investigator  
Choose one hypothesis with the strongest evidence and define one falsifiable experiment.

**Retry rule:** Maximum 3 hypothesis attempts total. Preserve failed experiment evidence. Do not repeat an unchanged experiment.

### 4. Approval gate
If the proposed remedy requires a schema/index change, production config change, query hint, dependency upgrade, write-capable raw SQL, or another boundary in `config/query-regression.yaml`, stop and request explicit human approval.

### 5. Minimal implementation
**Owner:** Query Fix Implementer  
Implement only the smallest evidence-backed code/test change. Run formatting, targeted tests, and build.

**Checkpoint:** Implementation tests pass and generated SQL snapshot exists.

### 6. Independent verification
**Owner:** Query Verification Agent  
Execute `skills/validate-query-fix.md`, run `scripts/verify-repository.sh`, compare before/after behavior and performance, then inspect the final diff.

**Checkpoint:** Verification report is PASS, FAIL, or NOT-VERIFIED with evidence.

### 7. Complete or escalate
Complete only when Definition of Done is satisfied. Otherwise preserve evidence and escalate with the current highest-confidence finding and blockers.

## Failure paths
- **Transient tool/database failure:** retry at most 2 times; preserve outputs.
- **Validation/build/test failure:** do not retry blindly; diagnose once, then return to the responsible stage.
- **Permission failure:** stop without widening permissions.
- **Non-reproducible regression:** mark root cause NOT-VERIFIED and stop.
- **Three failed hypotheses:** stop and escalate; do not continue autonomous optimization.

## Produced artifacts
- `artifacts/ef-query-investigation.md`
- `artifacts/generated-sql.txt`
- `artifacts/verification.md`
- Source/test diff when a safe code change is justified.

## Definition of Done
- Relevant repository context was gathered.
- Regression was reproduced or explicitly marked non-reproducible.
- Generated SQL was captured before and after any code change.
- Root-cause claim is supported by evidence.
- Behavioral tests pass.
- Relevant build passes.
- Performance verification used equivalent workload shape.
- Final diff contains no unintended changes.
- Approval-required actions have explicit approval or were not performed.
- Remaining risks are documented.
- Verification status is PASS with evidence.
