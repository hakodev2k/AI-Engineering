# Workflow: Change Impact Gate

## Entry condition
A non-trivial code or configuration change is requested and implementation has not started.

## Required inputs
- Change request
- Repository access
- Existing tests/build metadata
- Project-specific safety rules when available

## Stages

### 1. Trigger and request normalization
**Owner:** Main agent

- Convert the request into a one-sentence desired behavior change.
- Decide whether the task is trivial enough to skip the full gate.
- If uncertain, use the gate.

**Artifact:** normalized request.

**Checkpoint:** requested behavior is specific enough to identify an entry point.

### 2. Context gathering
**Owner:** Repository Mapper

Execute `skills/change-impact-analysis.md`.

Trace:
- entry points;
- callers/callees;
- state reads/writes;
- contracts;
- external integrations;
- configuration;
- operational behavior;
- tests.

**Artifact:** candidate `impact-manifest.json`.

**Checkpoint:** manifest is structurally valid and contains evidence.

### 3. Contract assessment
**Owner:** Repository Mapper

When any contract surface is present, execute `skills/contract-risk-assessment.md` and update the manifest.

**Checkpoint:** every material contract has compatibility classification and verification action.

### 4. Independent impact review
**Owner:** Impact Reviewer

Challenge:
- missing call paths;
- undocumented side effects;
- overlooked consumers;
- missing tests;
- optimistic risk classification;
- unrecorded approval boundaries.

Decision:
- `approved`;
- `needs-evidence`;
- `human-approval-required`.

### 5. Evidence loop
If decision is `needs-evidence`:

```text
Reviewer finding
  ↓
Repository Mapper investigates
  ↓
Manifest updated with evidence
  ↓
Reviewer reassesses
```

Maximum: **one revision cycle** after the initial review.

If unresolved after the second review, stop and escalate with evidence gaps.

### 6. Human approval gate
Human approval is mandatory before implementation when the reviewed change requires:
- database schema/migration changes;
- destructive data operations;
- breaking public or durable contracts;
- production configuration/infrastructure changes;
- secret/permission/security-control changes;
- force push/history rewrite;
- broad/high-risk dependency upgrades.

Record the approval in the manifest. Absence of approval is a hard stop.

### 7. Implementation
**Owner:** Implementation agent or developer

- Implement the smallest safe change consistent with the reviewed manifest.
- Follow repository conventions.
- Do not opportunistically expand scope.
- If implementation reveals a new affected component, pause and update/review the manifest before continuing when the impact is material.

**Artifact:** code/config/test changes.

### 8. Changed-file detection
**Owner:** Deterministic hook

Run:

```bash
python scripts/detect-changed-files.py --base <base-ref> --output changed-files.json
```

**Checkpoint:** actual changed files are captured.

### 9. Manifest reconciliation
**Owner:** Deterministic hook + implementation owner

Run:

```bash
python scripts/verify-impact-manifest.py --manifest impact-manifest.json --changed-files changed-files.json
```

If unexpected files exist:
- explain them with new evidence and update the manifest; or
- revert the unintended changes.

Do not whitelist unexplained files merely to pass verification.

### 10. Tests and contract verification
**Owner:** Implementation owner

Run the verification declared in the manifest:
- focused unit/integration tests;
- contract compatibility checks;
- build/static analysis;
- broader regression tests when risk requires them.

Transient environment failures may be retried at most twice. Deterministic code/test failures are fixed, not blindly retried.

### 11. Pre-completion review
**Owner:** Impact Reviewer or verification agent

Verify:
- actual changed files accounted for;
- required checks passed;
- no approval boundary was bypassed;
- unresolved risks are disclosed;
- requested behavior and acceptance criteria are satisfied.

## Retry rules
- Repository discovery: up to two alternative attempts.
- Reviewer evidence loop: one revision cycle.
- Transient test/build infrastructure failure: at most two retries.
- Same deterministic failure: no blind retry loop.

## Stop conditions
Stop immediately when:
- critical repository evidence cannot be obtained;
- required human approval is absent;
- the requested behavior conflicts with enforced repository safety rules;
- repeated verification failure remains unresolved after bounded diagnosis;
- the implementation requires materially broader scope than approved and re-analysis cannot be completed.

## Definition of Done
### Task completed
The requested implementation and associated tests/configuration have been created.

### Task verified
All of the following are true:
1. Reviewed impact manifest exists and is schema-valid.
2. Required approvals are recorded.
3. Actual changed files are reconciled with the manifest.
4. Required build/tests/contract checks pass.
5. No unexplained protected or out-of-scope paths changed.
6. Acceptance criteria are satisfied.
7. Remaining uncertainty/risk is explicitly reported.

Only `Task verified` may be reported as successful completion of the workflow.
