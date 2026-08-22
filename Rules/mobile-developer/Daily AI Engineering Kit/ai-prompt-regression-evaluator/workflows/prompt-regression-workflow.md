# Prompt Regression Workflow

## Trigger
A prompt, model setting, context assembly rule, tool instruction, safety policy, or output-format instruction is changed and may alter behavior.

## Entry conditions
- Baseline and candidate identities are available.
- Expected behavior can be represented by an eval suite.
- Approved runner can produce normalized run records.

## Required inputs
- Eval suite JSON
- Baseline run records
- Candidate run records
- `config/eval-policy.json`
- Candidate change description

## Flow

```text
Trigger
  ↓
Design/validate suite — Eval Analyst
  ↓
Run baseline + candidate — approved runner
  ↓
Validate records
  ↓
Aggregate repeated runs
  ↓
Deterministic regression gate
  ↓
Critical/borderline semantic review — Verification Reviewer
  ↓
Decision
  ├─ verified → eligible for human promotion decision
  ├─ regressed → reject candidate
  ├─ inconclusive → collect bounded additional evidence
  └─ blocked → stop and fix evidence/config
```

## Stages

### 1. Context and suite design
Owner: Eval Analyst.
Artifacts: eval suite, candidate change description.
Checkpoint: `scripts/validate-suite.py` exits 0.

### 2. Execute evaluations
Owner: workflow runner, not either semantic reviewer.
Run the configured number of repetitions for every required case. Preserve run ID, case ID, side (`baseline`/`candidate`), scores, assertions, latency, cost, and errors.

Transient runner failure may be retried once for the affected run. Preserve the first failed attempt. A repeated infrastructure failure stops the workflow.

### 3. Validate and aggregate
Owner: deterministic scripts.
Run `scripts/aggregate-results.py` separately for baseline and candidate. Missing critical cases, insufficient repetitions, or invalid result structure block the workflow.

### 4. Regression gate
Owner: deterministic script.
Run `scripts/evaluate-regression.py`. It evaluates critical worst-run behavior, aggregate quality delta, deterministic assertions, cost growth, and latency growth.

### 5. Independent semantic review
Owner: Verification Reviewer.
Required when the policy marks a case high-impact, a critical case is borderline, semantic scores regress near threshold, or the deterministic gate returns `inconclusive`.

Reviewer may request one additional evidence round. Maximum evidence rounds after the initial evaluation: 1. The suite/rubric may not be modified during this retry.

### 6. Promotion approval
A `verified` evaluator result means the candidate passed this gate; it does not authorize deployment. Production rollout, model/provider changes with material cost/security impact, or weakened safety behavior require explicit human approval.

## Failure paths
- **Validation failure:** stop; fix malformed suite/results, then rerun validation.
- **Runner/transient failure:** retry the affected run once; then stop and preserve evidence.
- **Quality regression:** reject candidate or change candidate; do not weaken the suite.
- **Cost/latency regression:** reject unless explicitly accepted by human and policy permits an override record.
- **Missing reviewer:** stop when independent review is required.
- **Incomparable baseline:** re-create baseline with the same suite version; do not infer equivalence.

## Stop conditions
Stop when a critical case regresses, evidence remains incomplete after the single additional round, runner repeatedly fails, required approval is absent, or suite identity differs.

## Definition of Done
- Suite validates.
- Required run counts exist for baseline and candidate.
- Aggregates are generated.
- Deterministic gate passes.
- Required semantic review is approved.
- Remaining non-blocking risks are documented.
- Final status is `verified`.
- Any production promotion remains separately approved.
