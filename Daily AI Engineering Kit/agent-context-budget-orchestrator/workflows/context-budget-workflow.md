# Workflow: Context Budget Orchestration

## Entry condition

Use when a task is expected to require multiple files, multiple tool calls, long logs, multi-stage reasoning, or context handoff.

## Required inputs

- task statement;
- repository access;
- budget config;
- optional prior `context-ledger.json`.

## Stages

### 1. Frame
Owner: primary agent.

Create explicit decision questions and identify dangerous actions that may require human approval.

Artifact: decision-question list.

Checkpoint: no repository-wide reading before the questions exist.

### 2. Scout
Owner: Context Scout.

Gather minimal evidence using `skills/context-selection.md` and create/update `context-ledger.json`.

Artifacts: ledger, unresolved evidence gaps.

Checkpoint: ledger validator passes.

### 3. Budget
Owner: deterministic script + primary agent.

Run the budget calculator. Reserve capacity for execution, test output, and verification.

Checkpoint: projected usage is within configured budget or an explicit exception exists.

### 4. Execute
Owner: implementation/execution agent.

Perform the requested engineering work using active context. Request targeted expansion only when a decision question cannot be answered safely.

Artifact: implementation changes and new evidence.

### 5. Checkpoint
Owner: primary agent.

Trigger after any of:

- material source file changes;
- hypothesis reversal;
- major test failure;
- completion of a subtask;
- context usage reaches warning threshold.

Actions:

1. mark invalidated ledger items stale;
2. compress completed branches;
3. recalculate budget;
4. request targeted refresh if needed.

### 6. Test and observe
Owner: execution agent.

Run relevant deterministic checks. Retain command, result, failing identifiers, and essential error evidence; discard repetitive noise after recording it.

### 7. Verify context
Owner: Context Verifier.

Check final claims against fresh critical evidence and inspect whether compression removed required context.

### 8. Complete
Owner: primary agent.

Report implementation status separately from verification status.

## Retry rules

- Repository search: maximum 2 alternate strategies for the same evidence gap.
- Stale-source refresh: maximum 2 cycles for the same unresolved claim.
- Environmental script/test failure: maximum 2 retries when evidence suggests a transient problem.
- Deterministic repeated failure: stop after the same failure occurs twice without a meaningful change.

## Human approval points

Require explicit approval before proceeding when safe reasoning would require dropping or ignoring critical context for:

- production deployment;
- schema/data migration;
- permission or security control changes;
- infrastructure changes;
- destructive actions;
- breaking public contracts.

## Stop conditions

Stop the workflow when:

- a required critical source is unavailable after bounded search;
- context budget cannot be satisfied without hiding required evidence;
- the same critical conflict remains unresolved after two targeted refresh cycles;
- required human approval is absent;
- verification fails on a safety-critical claim.

## Definition of Done

Task completed:

- requested implementation/work exists;
- applicable tests/checks ran.

Task verified:

- ledger validates;
- budget check passes or a documented exception exists;
- all critical final claims map to fresh source evidence;
- changed sources invalidated and refreshed dependent summaries;
- unresolved risks are reported;
- required approvals are recorded.
