# Token Budget Enforcement Workflow

## Trigger
Any AI engineering task with large repository context, long-running agent loops, multiple subagents, or a meaningful token/cost ceiling.

## Entry conditions
Task objective and acceptance criteria are known; policy is available; usage can be measured or deterministically estimated.

## Flow
```text
Trigger -> Inventory -> Budget plan -> Audit -> Execute
                                  | warn
                                  v
                              Compact (max 2)
                                  |
                                  v
                               Re-audit
                                  |
                       block -> Human approval
                                  |
                                  v
                           Verify -> Complete
```

## Stages
1. **Inventory** — planner identifies required modules, evidence sources, expected tests, and approval boundaries.
2. **Budget plan** — allocate expected usage across the four policy stages.
3. **Pre-execution audit** — Budget Auditor writes usage JSON and runs `scripts/token_budget_gate.py`.
4. **Compaction checkpoint** — on `warn`, Context Optimizer performs one pass and re-audits. A second pass is allowed only if still warned or blocked.
5. **Execution** — implementation proceeds only with `pass` or explicit human override.
6. **Expansion checkpoint** — whenever execution context grows above the configured growth ratio, re-audit.
7. **Verification audit** — reserve verifier budget; never consume it for implementation unless a human explicitly changes scope.
8. **Final verification** — build/tests/security checks run as required by the underlying task, then final token report is saved.

## Produced artifacts
- usage input JSON
- budget report JSON
- optional compact context packet
- override evidence when applicable

## Retry rules
Tool/transient gate execution may be retried once with identical inputs. Compaction is limited to two passes. Build/test retries belong to the underlying engineering workflow and must remain bounded independently.

## Failure paths
Invalid usage -> stop. Policy failure -> stop. Block after two compaction passes -> human approval or scope reduction. Permission failure -> stop without elevating privilege.

## Approval points
A human must approve any higher budget ceiling, reduced acceptance scope, discarded safety evidence, or production-impacting change requested to save tokens.

## Definition of Done
Final report is reproducible; status is `pass` or a valid override is recorded; acceptance/verification evidence remains intact; no unbounded loop occurred.
