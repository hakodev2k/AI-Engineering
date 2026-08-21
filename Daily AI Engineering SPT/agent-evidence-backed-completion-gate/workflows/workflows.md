# Workflows

## Workflow 1 — Evidence-Gated Task Completion

**Trigger:** any agent task that may end with a completion claim.

**Goal:** ensure `complete` means every mandatory requirement has fresh observable evidence.

**Inputs:** user request, repository state, completion policy.

**Baseline:** before enforcement, sample recent tasks and record how often final claims lack command/test/artifact evidence. If no baseline exists, record `baseline_unknown` rather than guessing.

**Context:** requirement contract, changed paths, executed checks, run-state terminal flag.

### Stages
1. **Contract** — Requirement Contract Agent assigns IDs and evidence expectations.
2. **Implement** — Implementation Agent changes only the scoped work.
3. **Observe** — Evidence Capture Agent records actual test/build/inspection outcomes.
4. **Freshness check** — compare post-evidence changes with covered paths and invalidate overlaps.
5. **Verify** — Independent Verification Agent runs `completion_gate.py`.
6. **Decision checkpoint**:
   - PASS → emit completion report.
   - FAIL with remediable gaps and retries remaining → route only blocking requirements back to implementation/testing.
   - FAIL with approval-required, unsafe, unavailable, or retry-exhausted gap → stop as incomplete/blocked.
7. **Final verification** — re-run gate after all remediation; do not reuse stale pass state.

**Responsible agents:** Contract → Implementation → Evidence Capture → Independent Verification → Orchestrator.

**Tools:** repository inspection, test/build tools, `scripts/evidence_probe.py`, `scripts/completion_gate.py`.

**Outputs:** evidence ledger, deterministic gate report, concise final status.

**Checkpoints:** contract accepted; evidence captured; freshness validated; gate result; retry count.

**Metrics:** mandatory evidence coverage, unsupported verified claims, stale evidence rejected, retries/task, false-block rate.

**Retry policy:** maximum 2 remediation cycles by default. Each retry must target named blocking requirement IDs and produce new evidence.

**Stop conditions:** gate passes; maximum retries reached; dangerous action requires human approval; verification cannot be performed; evidence integrity invalid.

**Failure path:** preserve current ledger and failed evidence; emit incomplete/blocked status with exact requirement IDs and missing/failed checks. Never downgrade verification requirements to force success.

**Verification:** run contract tests and ensure the final gate output is reproducible from the stored ledger.

**Definition of Done:** all mandatory requirements are `verified`, every verified item has fresh allowed evidence, loop state is terminal, gate exits 0, and no blocking reason remains.

## Workflow 2 — Stale Evidence Recovery

**Trigger:** files or dependencies change after a passing check.

**Goal:** prevent old validation from proving the final repository state.

**Inputs:** ledger, post-evidence changed paths, dependency impact when known.

**Baseline:** count currently fresh evidence items before the change.

**Stages:**
1. Gather paths changed after each evidence timestamp.
2. Match changed paths against evidence `paths` and requirement `covered_paths`.
3. Mark matching evidence `fresh=false`.
4. Downgrade affected requirement from `verified` to `implemented` or `partially_verified`.
5. Generate the smallest safe revalidation plan.
6. Execute checks once; a single additional retry is allowed only for environmental/transient failure, not product failure.
7. Re-run the completion gate.

**Responsible agent:** Independent Verification Agent coordinates; Evidence Capture Agent performs revalidation.

**Outputs:** freshness changes, revalidation evidence, new verdict.

**Checkpoints:** invalidation confirmed; revalidation scope reviewed; final gate.

**Metrics:** stale evidence count, revalidation latency, accepted stale evidence target 0.

**Retry policy:** max 1 retry for confirmed transient test infrastructure failure.

**Stop conditions:** evidence refreshed; product check fails; retry exhausted; unsafe check requires approval.

**Failure path:** keep requirement non-verified and report the stale/failed evidence explicitly.

**Verification:** mutate a covered file after a passing fixture and confirm the gate fails until new evidence is recorded.

**Definition of Done:** no final verified requirement depends exclusively on stale evidence.

## Workflow 3 — Headless/Automation Semantic Exit Guard

**Trigger:** CLI/headless agent invocation used by CI, cron, batch harness, or parent agent.

**Goal:** prevent process success from being interpreted as semantic completion when the agent loop is nonterminal.

**Inputs:** process exit code, transcript/run metadata, last stop reason, evidence ledger.

**Baseline:** record current automation success criterion (for example, `exit_code == 0`).

**Stages:**
1. Capture process exit code.
2. Inspect available terminal-state metadata.
3. If last state indicates pending tool continuation or active work, set `agent_loop_terminal=false`.
4. Run completion gate regardless of process exit code.
5. Only propagate semantic success when both process/infrastructure health and completion gate pass.

**Responsible agent:** Orchestrator / host harness.

**Outputs:** separate `process_success` and `task_complete` states.

**Checkpoints:** process ended; terminal semantics evaluated; evidence gate evaluated.

**Metrics:** false-success interceptions; incomplete exit-0 runs; recovery rate.

**Retry policy:** if host supports safe resume, one resume attempt may be made; otherwise stop incomplete. Never restart destructive side-effecting work without idempotency protection.

**Stop conditions:** gate passes, resume fails, state is ambiguous, or approval is needed.

**Failure path:** return incomplete with preserved transcript/evidence references.

**Verification:** fixture with `process_exit_code=0`, `agent_loop_terminal=false`, `last_stop_reason=tool_use` must exit nonzero from the gate.

**Definition of Done:** downstream systems never receive `complete=true` from process status alone.
