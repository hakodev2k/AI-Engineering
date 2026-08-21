# LLM Cost Anomaly Gate Workflow

## Trigger
Run for scheduled cost checks, CI changes to prompts/model routing/retry logic, or manual investigation of unexpected LLM spend.

## Entry conditions
A valid policy exists and usage events contain required fields.

## Inputs
`examples/usage-events.jsonl`-shaped usage data, `config/budget-policy.yaml`, repository changes, and optional billing/telemetry evidence.

## Stages
1. **Preflight** — validate files and usage-event shape. Responsible: workflow owner. Tool: `scripts/verify_package.py` and parser in `scripts/llm_cost_gate.py`.
2. **Gate** — evaluate total, request, user, and anomaly thresholds. Responsible: deterministic script.
3. **Investigate** — if status is `warn`, `block`, or `needs-approval`, Cost Investigator identifies measurable drivers.
4. **Plan** — choose the smallest safe correction; no production writes yet.
5. **Approval checkpoint** — required before hard-budget override, production billing/config changes, or high-cost model upgrades.
6. **Execute** — authorized owner applies the approved change outside this package.
7. **Retest** — collect representative after-change usage and re-run the gate. Maximum two retries for transient tooling failures only.
8. **Verify** — Verification Agent independently checks cost evidence and functional acceptance criteria.
9. **Complete** — emit final status and remaining risks.

## Produced artifacts
- `artifacts/cost-gate.json`
- Investigator finding set
- Optional completed `templates/budget-override-request.md`
- Verification result

## Checkpoints
- Invalid telemetry blocks the gate.
- Hard-budget breach stops before override until approval exists.
- Functional regression after optimization blocks completion.

## Retry rules
Maximum two retries per deterministic stage. Retry only transient I/O/tool failures. Preserve prior output/error evidence. Validation, permission, business-rule, or repeated failures are not retryable and must escalate.

## Failure paths
- **Validation failure:** stop, identify malformed/missing fields.
- **Tool failure:** retry at most twice, then stop with evidence.
- **Permission failure:** stop; do not increase permissions automatically.
- **Hard-budget breach:** stop at approval checkpoint.
- **Verification failure:** revert or revise the candidate change if safe; do not mark success.

## Definition of Done
Usage data was validated; gate executed; anomalies were investigated when present; required approval exists; after-change gate evidence is available; functional checks pass; independent verification is `verified`; remaining risks are recorded; no blocking failure remains.
