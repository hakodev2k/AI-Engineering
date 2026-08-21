# Integration Guide

## Purpose
This guide integrates the Evidence-Backed Completion Gate into coding-agent, CI, CLI, or multi-agent workflows without depending on hidden reasoning or natural-language self-certification.

## Integration boundary
Place the gate between **agent execution** and any downstream action that trusts semantic completion:

```text
Request
  -> Requirement contract
  -> Agent implementation
  -> Tool/test observations
  -> Evidence ledger
  -> Independent completion gate
  -> Complete? yes -> merge/handoff/notify
                 no  -> bounded remediation or blocked result
```

Do not place the gate only inside the model prompt. The deterministic scripts must be callable by the host/orchestrator.

## 1. Copy package components
Minimum runtime files:

```text
config/completion-policy.json
scripts/completion_gate.py
scripts/evidence_probe.py
schemas/completion-evidence.schema.json
```

Recommended process files:

```text
rules/engineering-rules.md
skills/core-skills.md
workflows/workflows.md
hooks/hooks.md
subagents/subagents.md
```

Python 3.10+ is recommended. The scripts use only the standard library.

## 2. Create a ledger at task start
Create `completion-evidence.json` with:
- stable `task_id`;
- `run_state.agent_loop_terminal=false` initially;
- one entry for every material requirement;
- explicit `mandatory` flags;
- initial statuses such as `not_addressed` or `unknown`;
- empty evidence arrays;
- remediation count 0.

Validate it:

```bash
python scripts/completion_gate.py validate \
  --ledger completion-evidence.json \
  --policy config/completion-policy.json
```

A validation failure is a workflow failure, not permission to skip the ledger.

## 3. Capture validation evidence immediately
After a real test or command:

```bash
python scripts/evidence_probe.py add \
  --ledger completion-evidence.json \
  --requirement REQ-001 \
  --type test \
  --command "dotnet test tests/Auth.Tests/Auth.Tests.csproj" \
  --exit-code 0 \
  --scope focused \
  --paths src/Auth tests/Auth.Tests \
  --result "42 tests passed"
```

For static inspection:

```bash
python scripts/evidence_probe.py add \
  --ledger completion-evidence.json \
  --requirement REQ-002 \
  --type inspection \
  --scope static \
  --paths docs/api.md \
  --result "Required endpoint documentation is present"
```

Do not use `claim` evidence to prove `verified`; it exists only for audit/debugging of unsupported assertions.

## 4. Update requirement status deliberately
The host or ledger-maintenance step should use these meanings:

- `not_addressed`: no implementation completed.
- `implemented`: change exists, but required verification is absent/stale.
- `partially_verified`: some relevant proof exists but verification breadth is incomplete.
- `verified`: required observable proof exists and is fresh.
- `blocked`: verification or implementation cannot proceed because of a named blocker.
- `unknown`: state cannot be established reliably.

Do not allow the LLM's final prose alone to set `verified`.

## 5. Invalidate evidence after further changes
Collect files modified after validation, for example:

```bash
git diff --name-only <tested-commit>..HEAD > changed-after-evidence.txt
```

Then:

```bash
python scripts/completion_gate.py freshness \
  --ledger completion-evidence.json \
  --changed-paths-file changed-after-evidence.txt
```

The package performs conservative path overlap invalidation. For monorepos or generated dependency graphs, extend the host to add affected downstream paths before invoking the script.

## 6. Represent terminal agent state separately from process exit
Before final gating, populate:

```json
{
  "run_state": {
    "agent_loop_terminal": true,
    "last_stop_reason": "end_turn",
    "process_exit_code": 0
  }
}
```

If a transcript ends after `tool_use`/tool results without a continuation step, use:

```json
{
  "agent_loop_terminal": false,
  "last_stop_reason": "tool_use",
  "process_exit_code": 0
}
```

The second case must not propagate semantic success.

## 7. Gate the final response or downstream action

```bash
python scripts/completion_gate.py gate \
  --ledger completion-evidence.json \
  --policy config/completion-policy.json \
  --report completion-report.json
```

Exit codes:
- `0`: complete;
- `2`: incomplete or blocked;
- `3`: invalid evidence/ledger;
- `4`: I/O failure.

Treat only exit 0 as semantic completion.

## 8. Bounded remediation
If the gate returns incomplete:
1. Parse `blocking_reasons`.
2. Send only the named missing/failed requirement IDs back to implementation/testing.
3. Increment `verdict.remediation_attempts`.
4. Capture new evidence.
5. Re-run freshness checks and the gate.
6. Stop after `max_remediation_retries` from policy.

Never retry merely because the model says it might succeed next time. A retry must target a concrete blocking reason.

## 9. High-risk independent verification
For production, security, permissions, migrations, billing, deletion, or deployment:
- use a separate verifier agent/process;
- keep implementation and verification roles distinct;
- require human approval for irreversible verification steps;
- retain the final evidence report with the change/commit/run.

## 10. CI example
Pseudo-shell integration:

```bash
set -euo pipefail
agent_exit=0
run-agent-command || agent_exit=$?

# Host adapter updates process_exit_code, terminal state, changed paths,
# evidence entries, and requirement statuses here.

if ! python scripts/completion_gate.py gate \
    --ledger completion-evidence.json \
    --policy config/completion-policy.json \
    --report completion-report.json; then
  echo "Semantic task completion gate failed"
  exit 2
fi
```

Do not replace the gate with `agent_exit == 0`.

## 11. Multi-agent integration
The parent/orchestrator owns the canonical ledger. Child agents may return evidence fragments, but the parent must validate and merge them using stable requirement IDs. Completed child work is not automatically `verified`; the verifier must confirm the evidence and freshness against the final merged state.

## 12. Observability
Track at minimum:
- `requirements_total`;
- `mandatory_requirements_total`;
- `mandatory_verified_total`;
- `unsupported_verified_claims_rejected`;
- `stale_evidence_invalidated`;
- `mid_tool_success_exits_rejected`;
- `remediation_attempts`;
- `completion_gate_status`;
- `false_block_review_count`.

## 13. Customization
Adjust policy for your environment, but preserve invariants:
- a mandatory requirement cannot be complete without verification;
- evidence must be observable and fresh;
- process success is not semantic completion;
- failed/skipped checks remain visible;
- retries remain bounded.

You may add organization-specific evidence types only if the deterministic gate can validate them. Never add `model_confidence` or hidden reasoning as an accepted verification source.
