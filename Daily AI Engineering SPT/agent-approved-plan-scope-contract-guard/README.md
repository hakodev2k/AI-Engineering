# Agent Approved Plan Scope Contract Guard

## Topic
Prevent approved-plan drift and silent task-scope expansion during AI-agent execution.

## Category
Thinking

## Problem
Current coding agents can produce a reasonable plan, receive approval, and later treat that plan as advisory rather than binding. Tool failures, context compaction, delegation, sandbox friction, or local improvisation can cause adjacent edits, broader architecture changes, or execution after ambiguous approval state. Per-tool approvals do not solve the task-level problem because they authorize a local action without proving that the action still belongs to the approved implementation contract.

## Evidence
`evidence/research.md` documents current public signals. Recent Codex reports from August 2026 describe approved plans silently broadening during execution and explicit one-item scope being violated. Claude Code reports show plan-mode/approval state can also become ambiguous or advisory governance can be ignored. These are observed signals; the contract design here is a proposed reusable engineering response.

## Existing approach
Typical workflows rely on prose plans, plan mode, instruction files, tool/file approval prompts, sandbox roots, hooks, and manual final diff review.

## Existing limitations
- Prose plans are not immutable machine-checkable authorization artifacts.
- Approval is often bound to a UI/state transition rather than a plan hash/version.
- File/tool prompts cannot detect cumulative task-level scope drift.
- Advisory hooks remain model-dependent.
- Subagents and generated changes can escape a narrow local view.
- Final diff review catches drift after work has already happened.

## Proposed improvement
Treat an approved plan as a versioned execution contract:

**Approve → Compile → Hash/Bind → Baseline → Pre-mutation Gate → Execute → Checkpoint → Deviation Gate → Verify → Complete**

The contract records allowed/forbidden paths, operation classes, acceptance criteria, invariants, baseline, explicit approval identity, and amendment lineage. Material deviations stop before mutation and require a new approved version. Completion requires cumulative baseline-to-final verification.

## Architecture
1. **Contract Compiler** normalizes the approved plan and captures repository baseline.
2. **Plan Contract** is immutable and identified by SHA-256/version.
3. **Scope Guard** performs deterministic path/operation checks before mutation.
4. **Checkpoint Audit** compares cumulative Git changes against the active contract.
5. **Deviation Analyst** separates evidence from hypothesis and proposes the smallest amendment when required.
6. **Independent Verifier** proves final diff, criteria, and invariants match the active contract chain.

## Package structure
```text
agent-approved-plan-scope-contract-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── plan-contract.schema.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   └── plan_scope_guard.py
├── tests/
│   └── test_plan_scope_guard.py
└── verification/
    └── verification.md
```

## Installation
Requirements:
- Python 3.10+
- Git
- `pytest` for the included test suite

No third-party runtime library is required by the guard script.

Run tests:
```bash
python -m pytest tests/test_plan_scope_guard.py -q
```

## Configuration
Create a `plan-contract.json` conforming to `config/plan-contract.schema.json`. Keep scope narrow and explicitly list sensitive/forbidden patterns. The `contract_id` must equal the SHA-256 of canonical JSON excluding the `contract_id` field. The integration layer should create/bind this contract immediately after explicit approval.

Important fields:
- `allowed_paths` / `forbidden_paths`
- `allowed_operation_classes`
- `acceptance_criteria`
- `invariants`
- `out_of_scope`
- `baseline_ref`
- `approved_by` / `approved_at`
- `parent_contract_id` for amendments

## Usage
Freeze an approved contract and baseline:
```bash
python scripts/plan_scope_guard.py freeze \
  --contract plan-contract.json \
  --repo . \
  --snapshot .plan-guard/baseline.json
```

Check a proposed action:
```bash
python scripts/plan_scope_guard.py check \
  --contract plan-contract.json \
  --repo . \
  --operation edit \
  --path src/pricing/PriceService.cs
```

Audit cumulative drift:
```bash
python scripts/plan_scope_guard.py verify \
  --contract plan-contract.json \
  --repo . \
  --snapshot .plan-guard/baseline.json \
  --json
```

See `guide-intergration.md` for Codex, Claude Code/custom host, subagent, and CI integration patterns.

## Workflow
The primary flow is defined in `workflows/workflows.md`:
1. Capture baseline.
2. Compile and bind approved contract.
3. Gate every mutation.
4. Track cumulative scope at checkpoints.
5. On failure, retry only inside scope and within a maximum of two retries for the same mechanism.
6. If a material deviation is needed, stop and create version N+1 for explicit approval.
7. Join all mutators and independently verify baseline-to-final state before completion.

## Metrics
Recommended runtime metrics:
- out-of-scope mutation escape rate;
- changed-path explanation ratio;
- acceptance-criterion evidence coverage;
- material deviations blocked before mutation;
- amendment frequency and size;
- repeated-failure retry count;
- unexplained delegated/generated file count;
- rework caused by scope drift.

Targets for a verified run are 0 unauthorized material deviations, 100% changed-path explanation, 100% criterion evidence coverage, zero unresolved invariant violations, and bounded retries.

## Verification
`verification/verification.md` distinguishes three states:
- **Implemented:** mechanisms/files exist.
- **Measured:** target integration collected the defined metrics.
- **Verified:** adversarial tests and plan-to-result checks pass in the target harness.

The package intentionally does not claim target runtime behavior is Verified merely because code was generated.

## Safety
- Task-level scope is independent from per-tool approval.
- Unknown paths/operations fail closed.
- Forbidden patterns override broad allowed patterns.
- Material architecture, dependency, schema, deployment, destructive, security, or business-rule deviations require explicit amendment approval.
- Subagents cannot amend or self-approve the parent contract.
- Security/verification/acceptance criteria must never be weakened to avoid a deviation gate.
- Dangerous or irreversible operations require explicit human approval even if represented by a contract.

## Failure handling
Detection uses pre-mutation checks plus cumulative checkpoints. Evidence includes contract ID, operation/path, baseline, diff, retry history, and test output. Retry is bounded to two attempts for the same failed mechanism and only while remaining in scope. If the minimal workaround is material, execution stops for amendment. Missing approval, contract mismatch, unknown mutation target, exhausted retries, or unexplained final changes are stop conditions rather than reasons to widen scope.

## Definition of Done
A task is complete only when:
- current public problem evidence is documented;
- an approved contract and baseline exist;
- all mutations were evaluated against the active contract/version;
- every material deviation has an explicitly approved amendment;
- retry budgets were respected;
- no mutating worker remains active;
- every changed file is explained by scope/amendment;
- acceptance criteria have concrete evidence;
- invariants and forbidden scope remain intact;
- independent verification is complete for material/high-risk changes;
- no blocking violation remains.

## Customization
Extend the schema for non-file resources such as database objects, cloud resources, APIs, queues, or deployment environments. Preserve the core semantics: immutable approval binding, default deny, cumulative evidence, explicit amendment for material deviation, bounded recovery, and independent verification.