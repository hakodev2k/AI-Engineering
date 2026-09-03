# Fallback Model Behavior Parity Gate Workflow

## Trigger
A fallback model/provider/version or failover routing path is introduced or changed.

## Entry conditions
Primary and fallback are callable in a non-production evaluation environment; frozen scenarios and evidence storage are available.

## Inputs
Scenario suite, primary/fallback identifiers, prompt/tool/schema fixtures, policy thresholds.

## Stages
1. **Context** — owner: planner. Locate routing code, prompts, tool schemas, existing evals, and critical behavior contracts.
2. **Freeze** — owner: planner. Freeze inputs and record hashes/versions.
3. **Primary run** — owner: evaluation runner. Produce primary result JSON and raw evidence.
4. **Fallback run** — owner: evaluation runner. Produce fallback result JSON and raw evidence.
5. **Deterministic gate** — run validation then comparison scripts. Failure blocks completion.
6. **Repair loop** — owner: implementation agent. Only compatibility changes within approved repository boundaries. Maximum 2 iterations; each iteration reruns the entire frozen suite.
7. **Independent verification** — owner: `subagents/parity-verifier.md`.
8. **Approval boundary** — any production routing/deployment/config/security/public-contract change stops for explicit human approval.
9. **Complete** — only after `verified-pass`.

## Checkpoints
Frozen fixture identity; valid result contracts; parity report; diff inspection; independent verification.

## Retry rules
Transient provider/tool error: one retry per failed run, retaining first-attempt evidence. Validation or semantic parity failure is not transient. Corrective loop: maximum 2 iterations.

## Failure paths
Missing scenario/evidence -> blocked. Fallback safety/contract failure -> fail. Environment/permission failure -> blocked. Threshold regression -> fail. Two unsuccessful repairs -> escalate with evidence.

## Produced artifacts
Primary result JSON, fallback result JSON, `fallback-parity-report.json`, verifier decision, implementation diff if applicable.

## Definition of Done
All required scenarios exist; deterministic checks pass; fallback preserves required safety/contracts; score/cost/latency thresholds pass; independent verifier returns `verified-pass`; dangerous actions remain unexecuted unless separately approved.
