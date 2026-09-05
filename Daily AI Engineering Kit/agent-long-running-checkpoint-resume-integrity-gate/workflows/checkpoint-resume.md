# Workflow: Checkpoint Resume Integrity

## Trigger
A long-running agent is about to pause or resume persisted work.

## Entry conditions
Task identity is known; repository is readable; checkpoint persistence is available.

## Stages
1. **Checkpoint preparation** — Implementation owner invokes Create Safe Checkpoint.
2. **Pause** — no further mutation after checkpoint unless a fresh checkpoint is created.
3. **Resume capture** — Checkpoint Inspector captures current state.
4. **Integrity gate** — deterministic comparison against policy.
5. **Context refresh** — on pass, re-read relevant files/tests/requirements.
6. **Drift branch** — on fail, Resume Planner selects replan/restart/approval refresh/stop.
7. **Approval checkpoint** — dangerous actions require current explicit human approval.
8. **Execute bounded next action** — implementation owner resumes only approved stage.
9. **Test** — relevant build/unit/integration/E2E checks.
10. **Independent verification** — Verification Agent reviews current evidence.
11. **Complete or create next checkpoint**.

## Artifacts
Checkpoint JSON, current-state JSON, resume report JSON, replanning record when needed, approval evidence, test/build evidence, verification result.

## Retry rules
- transient Git/tool read failure: maximum 2 retries
- post-resume implementation/test failure: maximum 2 fix cycles
- integrity mismatch: zero blind retries; replan required
- permission/approval failure: zero automatic retries

## Failure paths
Repository drift -> reload changed context and replan. Expired approval -> human refresh. Scope/task mismatch -> restart from exploration. Environment mismatch when policy requires it -> move to compatible environment or restart. Repeated test failure -> stop with evidence.

## Definition of Done
Deterministic gate passes after any required replanning, relevant context is refreshed, bounded resumed work completes, tests/build pass, independent verifier returns `verified`, and no blocking approval/integrity failure remains.
