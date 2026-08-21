# Agent Permission-Policy Consistency Verifier

## Topic
Agent permission-policy consistency across parent/subagent, sandbox, reviewer/classifier, hook, MCP/app, desktop/CLI/SDK, and saved-approval boundaries.

## Category
**Security**

## Problem
Coding-agent permission behavior is no longer controlled by one switch. Effective authorization can depend on session mode, sandbox/network policy, allow/ask/deny rules, auto-review or classifiers, hooks, MCP/app annotations, command segmentation, UI surface, and child-agent inheritance.

Recent public bug reports show these layers can disagree. A parent session may be configured to bypass prompts while a subagent still prompts; a classifier may block calls while the session transcript still reports bypass mode; or a desktop UI can indicate full access while sandbox/network gates and saved command approvals behave differently.

The operational risk has two sides:
- **security drift:** an action unexpectedly executes when policy intended `ask` or `deny`;
- **reliability drift:** safe/approved work unexpectedly asks or denies, stalling unattended workflows.

This package treats permission correctness as a conformance problem: define expected decisions first, collect effective runtime outcomes, compare them deterministically, and fail closed on mismatches.

## Evidence
The research is documented in `evidence/research.md`.

Key current signals include:
- Anthropic Claude Code #83421: `bypassPermissions` behavior reported not to propagate consistently to Task/Agent subagents.
- Anthropic Claude Code #84390: `automode-blocked` denials reported while the session continued recording `bypassPermissions`.
- OpenAI Codex #30898: full-access UI state and approved prefixes reported to coexist with later prompts and sandbox/network failures.
- OpenAI engineering guidance separates sandbox boundaries from approval policy, reinforcing that a single user-visible mode is not the complete effective authorization state.

## Existing approach
Common approaches include:
- trusting the active permission mode or full-access UI label;
- maintaining allow/ask/deny lists;
- storing command-prefix approvals;
- using hooks and automatic reviewers/classifiers;
- disabling prompts globally for automation;
- manually spot-checking a few commands.

## Existing limitations
These controls are necessary but configuration presence does not prove effective enforcement across every actor and surface. Subagent inheritance, hook precedence, tool annotations, network/filesystem sandboxes, command segmentation, and product-specific behavior can change the final decision. Manual tests are difficult to repeat across versions and can miss intermittent regressions.

## Proposed improvement
Use a versioned **permission scenario matrix** as the policy oracle and compare it with observed runtime decisions.

The core loop is:

**Define policy → freeze scenarios → collect effective decisions → compare deterministically → classify mismatch → isolate gate → apply minimal fix → rerun full matrix → independently verify**

Expected decisions are never rewritten merely to match the runtime.

## Architecture

### Policy layer
`config/policy-matrix.example.json` defines the reusable schema and representative allow/ask/deny scenarios. Environment owners copy it to an environment-specific matrix and define their actual expectations.

### Evidence layer
A runtime adapter, hook, or manual safe test produces JSONL observations with stable scenario IDs and observed decisions/reasons.

### Verification layer
`scripts/permission_consistency_verifier.py` validates matrix/observations, requires critical coverage, compares decisions and reason classes, classifies mismatches, emits JSON, and returns non-zero on failure.

### Process layer
Skills, Rules, Subagents, Workflows, Hooks, and verification guidance ensure the test oracle stays independent from implementation behavior and that remediation is bounded.

## Package structure

```text
agent-permission-policy-consistency-verifier/
├── README.md
├── guide-intergration.md
├── evidence/
│   └── research.md
├── config/
│   └── policy-matrix.example.json
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
│   └── permission_consistency_verifier.py
├── tests/
│   ├── observations.example.jsonl
│   └── test_verifier.py
└── verification/
    └── verification.md
```

## Installation
Requires Python 3.9+ and only the Python standard library.

From this package directory:

```bash
python -m unittest tests/test_verifier.py
```

No external package installation is required.

## Configuration
Copy the example matrix:

```bash
cp config/policy-matrix.example.json config/policy-matrix.json
```

Edit it to reflect your actual policy. Each scenario contains:
- `id`
- `actor`
- `surface`
- `action`
- `risk`
- `expected_decision`
- `expected_reason_class`

`critical_scenarios` lists scenario IDs whose absence must fail verification even when `--require-all` is not used.

Do not use the example matrix as authorization for a real environment.

## Observation format
Create JSON Lines such as:

```json
{"scenario_id":"allow-parent-read-status","observed_decision":"allow","observed_reason_class":"policy-allow","source":"cli-smoke-test","timestamp":"2026-08-21T01:00:00+07:00"}
```

Allowed decisions are `allow`, `ask`, and `deny`.

Record the effective outcome at the execution boundary. Do not substitute model narration such as "this should be allowed" for runtime evidence.

## Usage
Run the verifier:

```bash
python scripts/permission_consistency_verifier.py \
  --matrix config/policy-matrix.json \
  --observations artifacts/permission-observations.jsonl \
  --require-all \
  --report artifacts/permission-report.json
```

Exit codes:
- `0` — pass;
- `2` — mismatch or missing required scenario;
- `3` — invalid input/configuration;
- `4` — I/O error.

## Workflow
### 1. Establish baseline
Inventory boundaries, approve the expected scenario matrix, collect safe observations, run the verifier, and independently review critical boundaries.

### 2. Diagnose mismatch
Classify unexpected allow/ask/deny or reason drift. Isolate likely layers in a structured order: surface → session mode → sandbox/network → policy rule → hook → classifier/reviewer → tool annotation → delegation inheritance → command segmentation/prefix scope.

### 3. Remediate minimally
Apply only the evidence-backed integration/configuration change. Do not widen global permissions merely to eliminate prompts.

### 4. Regress the full matrix
Re-run the frozen matrix, not only the original failing scenario.

### 5. Upgrade gate
Repeat the matrix after runtime, hook, MCP/tool, permission, or delegation changes.

See `workflows/workflows.md` for triggers, checkpoints, retry limits, failure paths, and Definition of Done.

## Skills
`skills/core-skills.md` provides three reusable procedures:
1. Build a permission conformance matrix.
2. Collect effective runtime decisions.
3. Reconcile expected vs effective permission state.

Each skill defines triggers, inputs, procedures, decisions, constraints, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` defines observable MUST / MUST NOT / SHOULD controls. The most important invariant is:

> Expected policy is the oracle. Runtime behavior is evidence, not a reason to rewrite the oracle.

An unexpected `allow` where policy expects `ask` or `deny` is a blocking security failure.

## Subagents
`subagents/subagents.md` separates responsibilities so the implementing agent is not the sole verifier:
- Permission Evidence Collector
- Permission Policy Analyst
- Integration Implementer
- Independent Permission Verifier

## Hooks
`hooks/hooks.md` defines predictable integration points:
- pre-run baseline check;
- post-permission-decision recorder;
- unexpected-allow circuit breaker;
- delegation inheritance checkpoint;
- final permission verification.

## Metrics
Track by environment and runtime version:
- configured scenario count;
- observed scenario count;
- required scenario coverage;
- overall mismatch count;
- security mismatch count;
- reliability mismatch count;
- unexplained reason count;
- parent/subagent paired-scenario agreement;
- repeatability across clean reruns.

Recommended security acceptance threshold for unattended or sensitive environments:
- 0 unexpected allows;
- 100% critical scenario coverage;
- 0 unexplained critical decisions;
- all required unattended scenarios free of unexpected ask/deny stalls.

## Verification
`verification/verification.md` distinguishes three states:

### Implemented
The package files, matrix schema, verifier, tests, and workflows exist.

### Measured
Fresh observations have been collected from the target runtime with environment metadata.

### Verified
The verifier passes the complete required matrix and an independent reviewer confirms critical boundaries.

Package unit tests:

```bash
python -m unittest tests/test_verifier.py
```

The tests verify:
- the example observation set passes;
- a critical expected-deny → observed-allow mutation fails as a security mismatch;
- a missing critical scenario fails rather than being mistaken for success.

## Safety
- Never test destructive permission behavior against real home directories, production systems, credential stores, or live deployment targets.
- Prefer temp directories, mock endpoints, fake remotes, synthetic credential filenames, and dry-run commands.
- Never include secrets or raw credential-bearing transcript content in observations/reports.
- Do not disable sandbox, hooks, classifier, or approval controls solely to make the test pass.
- Any real permission broadening requires explicit human approval.

## Failure handling
### Detection
Non-zero verifier exit, unexpected allow, missing critical observation, or unexplained critical decision.

### Evidence
Preserve sanitized matrix, observations, report, runtime version, config versions/hashes, and minimal reproduction.

### Retry policy
One clean-session retry for plausible stale state/collection error. Maximum two evidence-backed remediation cycles.

### Fallback
Restore the last verified runtime/configuration where feasible and disable the affected unattended capability.

### Escalation
Escalate with a minimal sanitized reproduction to the platform/security owner or upstream vendor/framework.

### Stop condition
Stop immediately on unexpected allow for a high/critical scenario. Never weaken the expected security policy to avoid failure.

## Definition of Done
The package or a target integration is complete only when:
- current evidence is documented;
- expected policy matrix is reviewed;
- deterministic tests pass;
- fresh target observations are captured;
- required scenario coverage is complete;
- comparison report is generated;
- no blocking security mismatch remains;
- unattended-critical reliability mismatches are resolved;
- parent/subagent inheritance has been tested when applicable;
- risks and intentional exceptions are documented;
- independent verification is complete;
- evidence contains no secrets.

## Customization
Extend the matrix with environment-specific scenarios such as:
- production deployment confirmation;
- package installation/network egress;
- `git push` or merge actions;
- cloud CLI writes;
- secret-store access;
- protected path writes;
- MCP/app destructive actions;
- reviewer/classifier-specific denials;
- parent vs nested subagent behavior;
- CLI vs desktop vs SDK parity;
- post-compaction or long-session permission-state checks.

Keep scenario IDs stable across runtime versions so behavior changes become visible rather than silently normalized.
