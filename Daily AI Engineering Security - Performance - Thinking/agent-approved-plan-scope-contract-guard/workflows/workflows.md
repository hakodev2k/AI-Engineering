# Workflows

## Workflow A — Plan Approval to Safe Execution
**Trigger:** User explicitly approves an implementation plan.
**Goal:** Convert approval into an enforceable task-level contract before any mutation.
**Inputs:** Approved plan, repository root, project rules.
**Baseline:** Commit SHA, dirty-state manifest, current dependency/schema state where relevant.
**Context:** Goal, scope, criteria, invariants, exclusions.

### Stages
1. **Observe** — Contract Compiler captures plan text and repository baseline.
2. **Compile** — Normalize contract fields and validate schema.
3. **Bind** — Compute contract hash and bind explicit approval to that hash/version.
4. **Preflight** — Scope Verifier checks planned paths/operations for ambiguity or over-broad scope.
5. **Execute** — Execution Agent performs only contract-authorized actions.
6. **Checkpoint** — After each logical unit, record cumulative changed paths and criteria progress.
7. **Verify** — Independent Verification Agent compares final state to baseline and contract.

**Responsible agents:** Contract Compiler → Execution Agent → Verification Agent.
**Tools:** Git status/diff, schema validator, `plan_scope_guard.py`, build/test tooling.
**Outputs:** Contract, baseline, action checkpoints, final verification report.
**Checkpoints:** Contract binding; first mutation; each subsystem completion; pre-completion.
**Metrics:** unexplained changed paths, material deviation count, criteria coverage, retry count.
**Retry policy:** Maximum 2 retries per failing mechanism; only in-scope retries allowed.
**Stop conditions:** Ambiguous approval; contract invalid; material deviation; retry budget exhausted; unexplained final diff.
**Failure path:** Deviation workflow or clean stop with evidence.
**Verification:** Every final changed path authorized; all criteria evidenced; invariants preserved.
**Definition of Done:** Final verification passes and no active mutating work remains.

## Workflow B — Material Deviation Gate
**Trigger:** Planned mechanism fails or implementation discovers a requirement not represented by the active contract.
**Goal:** Prevent workaround chains from silently broadening scope.
**Inputs:** Failure evidence, active contract, cumulative diff, retry count.
**Baseline:** Active contract version and last successful checkpoint.
**Context:** Facts, assumptions, proposed workaround, blast radius.

### Stages
1. Capture the exact observed failure.
2. Test whether a retry remains inside the current contract.
3. If retry is justified and budget remains, retry once and re-measure.
4. If not resolved, produce the smallest alternative and classify added paths/operations/invariants.
5. Run material-deviation test.
6. For material deviation, create contract version N+1 and stop for explicit approval.
7. On approval, rebind execution to the new hash; on rejection/no approval, stop.

**Responsible agent:** Deviation Analyst; human/user owns material approval.
**Tools:** Read-only diagnostics, diff, contract compiler.
**Outputs:** Retry evidence, amendment request, or stop record.
**Checkpoints:** Before every out-of-contract mutation.
**Metrics:** retries before amendment, amendment size, avoided unauthorized writes.
**Retry policy:** Hard maximum 2 for same mechanism.
**Stop conditions:** Amendment required but not approved; unknown risk; security/quality invariant would be weakened.
**Failure path:** Preserve current workspace and emit blocking evidence.
**Verification:** New contract parent/hash/approval chain is valid.
**Definition of Done:** Either execution resumes under approved contract N+1 or stops without unauthorized mutation.

## Workflow C — Plan-to-Result Verification
**Trigger:** Agent intends to claim completion.
**Goal:** Detect silent drift before completion is reported.
**Inputs:** Contract chain, baseline, final repository state, action log, test evidence.
**Baseline:** Original approved baseline plus approved amendments.
**Context:** Acceptance criteria and invariants.

### Stages
1. Wait/join all mutating workers or stop if lifecycle state is unknown.
2. Produce baseline-to-final name-status and content diff.
3. Run guard verification over changed paths and recorded operation classes.
4. Map each path to an allowed pattern or approved amendment.
5. Map each acceptance criterion to test/output evidence.
6. Re-check invariants and forbidden scope.
7. Classify: **Implemented** (changes exist), **Measured** (evidence collected), **Verified** (all gates pass), or **Blocked**.

**Responsible agent:** Verification Agent independent of implementer for material changes.
**Tools:** Git diff, tests/build, scope guard.
**Outputs:** Verification report.
**Checkpoints:** Before user-facing completion message.
**Metrics:** changed-path explanation ratio (target 100%), criterion coverage (target 100%), invariant violations (target 0).
**Retry policy:** At most 2 in-contract repair cycles; amendment required beyond current scope.
**Stop conditions:** Unexplained changes, missing evidence, failing invariant, active worker, or exhausted repair budget.
**Failure path:** Return to Execution Agent only for clearly in-scope repair; otherwise amendment/stop.
**Verification:** Independent evidence only; agent summaries are not sufficient.
**Definition of Done:** 100% scope explanation + 100% criteria evidence + zero unresolved violations.