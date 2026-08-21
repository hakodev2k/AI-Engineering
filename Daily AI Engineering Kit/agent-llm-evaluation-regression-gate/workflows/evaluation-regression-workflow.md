# Evaluation Regression Workflow

## Trigger
Any change to model, prompt, context construction, retrieval, memory, tool selection/contracts, structured-output behavior, or safety policy that can alter AI behavior.

## Entry conditions
Task acceptance criteria exist; repository is readable; evaluation data is sanitized; current approved baseline is available or can be created with approval.

## Inputs
Requirements, baseline JSONL, candidate runner output, `config/eval-gate.yaml`, relevant source/tests.

## Flow
`Trigger -> Scope -> Baseline -> Change -> Candidate run -> Validate -> Gate -> Triage -> Re-run -> Independent verify -> Complete`

## Stages
1. **Scope — Evaluation Planner:** inspect only relevant repository paths; create case plan and critical cases.
2. **Baseline:** run current approved implementation; validate baseline. Replacing an existing approved baseline requires human approval.
3. **Execute — Implementation Agent:** make smallest supported change; run repository tests.
4. **Candidate:** run identical cases and evaluator contract; preserve outputs.
5. **Validate:** run `python scripts/validate_eval_jsonl.py evals/baseline.jsonl` and candidate equivalent.
6. **Gate:** run `python scripts/eval_gate.py --baseline evals/baseline.jsonl --candidate evals/candidate.jsonl --config config/eval-gate.yaml --out eval-gate-report.json`.
7. **Triage:** semantic regression gets diagnosis, not blind retry. Infrastructure/transient execution may retry at most 2 times while preserving failed evidence.
8. **Verify — Verification Agent:** rerun gate, inspect diff/tests and approvals independently.

## Checkpoints
- Case IDs and required dimensions match.
- No critical regression.
- Thresholds unchanged unless explicitly approved.
- Relevant build/tests pass.
- Candidate cost/latency within configured bounds.

## Failure paths
Validation failure -> fix artifact generation, maximum 2 attempts. Tool/network transient -> retry maximum 2. Semantic failure -> return to diagnosis/implementation. Permission or ambiguous requirement -> stop and escalate. Evaluator defect -> stop; evaluator change requires approval.

## Approval points
Baseline replacement, threshold weakening, evaluator change, production model/config change, deployment, breaking contract, secret/permission change.

## Definition of Done
Gate exit code 0; independent verifier status `verified`; relevant tests pass; all critical cases pass; required approvals recorded; remaining non-blocking risks documented.
