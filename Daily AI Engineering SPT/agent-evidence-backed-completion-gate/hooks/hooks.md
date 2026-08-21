# Hooks

## Hook — Pre-task contract validation
**Trigger:** before implementation starts or before an inherited task is resumed.

**Action:** ensure the requirement ledger exists, has stable unique IDs, and classifies each material requirement as mandatory/optional with an expected evidence type.

**Command/script:**
```bash
python scripts/completion_gate.py validate --ledger completion-evidence.json --policy config/completion-policy.json
```

**Expected result:** exit 0 and a valid contract summary.

**Failure behavior:** stop implementation handoff; repair the contract without inventing requirements. If the task is already in progress, mark verification state incomplete until the ledger is valid.

## Hook — Post-validation evidence capture
**Trigger:** immediately after a test/build/check/inspection command completes.

**Action:** append the actual observation to the evidence ledger rather than relying on conversational memory.

**Command/script:**
```bash
python scripts/evidence_probe.py add \
  --ledger completion-evidence.json \
  --requirement REQ-001 \
  --type test \
  --command "dotnet test tests/Auth.Tests" \
  --exit-code 0 \
  --scope focused \
  --paths src/Auth tests/Auth.Tests \
  --result "42 passed"
```

**Expected result:** atomic ledger update with timestamp and fresh evidence entry.

**Failure behavior:** do not mark the requirement verified; preserve command exit/result separately if possible and retry ledger persistence once.

## Hook — Post-change freshness check
**Trigger:** any code/config/dependency write after verification evidence exists.

**Action:** pass changed paths to the completion gate so overlapping evidence is invalidated.

**Command/script:**
```bash
python scripts/completion_gate.py freshness \
  --ledger completion-evidence.json \
  --changed-paths-file changed-after-evidence.txt
```

**Expected result:** affected evidence becomes `fresh=false`; status is downgraded if no other fresh proof remains.

**Failure behavior:** fail closed by treating impacted verification as stale/unknown.

## Hook — Pre-response completion gate
**Trigger:** before emitting words such as complete, fixed, implemented successfully, all tests pass, PR-ready, deployment-ready, or before signaling semantic success to automation.

**Action:** evaluate the final ledger and run state deterministically.

**Command/script:**
```bash
python scripts/completion_gate.py gate \
  --ledger completion-evidence.json \
  --policy config/completion-policy.json \
  --report completion-report.json
```

**Expected result:** exit 0 only when all mandatory requirements are verified with fresh allowed evidence and agent loop state is terminal.

**Failure behavior:** block the success claim. Send blocking requirement IDs through the bounded remediation workflow or return incomplete/blocked after retry exhaustion.

## Hook — Headless process exit guard
**Trigger:** agent CLI/process exits in CI, cron, batch execution, or parent-agent orchestration.

**Action:** separate infrastructure/process status from semantic completion. Populate `run_state.process_exit_code`, `run_state.agent_loop_terminal`, and `last_stop_reason`, then invoke the gate.

**Command/script:**
```bash
python scripts/completion_gate.py gate --ledger completion-evidence.json --policy config/completion-policy.json
```

**Expected result:** exit 0 only for semantically complete tasks; exit 2 for incomplete/blocked and exit 3 for invalid evidence.

**Failure behavior:** never translate an exit-0 agent process into task success if the completion gate fails.

## Hook — Final independent verification
**Trigger:** after the last remediation attempt and before high-impact handoff/merge/deploy.

**Action:** an agent/process other than the implementation agent inspects the requirement/evidence matrix and executes the deterministic gate.

**Command/script:** same pre-response gate command plus project-specific tests where required.

**Expected result:** gate passes and verifier confirms no mandatory requirement is supported only by stale/self-asserted evidence.

**Failure behavior:** stop as incomplete/blocked; do not create further retries after policy maximum.
