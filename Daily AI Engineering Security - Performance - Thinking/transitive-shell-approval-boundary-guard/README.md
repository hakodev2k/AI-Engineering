# Transitive Shell Approval Boundary Guard

## Topic
Approval boundaries that fail to inspect effects hidden behind scripts and interpreters.

## Category
Security

## Problem
Tool-level approval can become misleading when an allowed outer command such as `bash helper.sh` executes agent-authored code containing destructive or otherwise protected operations. Recent Claude Code reports show that literal command inspection and tool-local hooks can be bypassed through alternate execution surfaces.

## Evidence
See `evidence/research.md`. The package is grounded in Claude Code issue #85274 (2026-08-09), issue #29709, and prior high-severity approval-bypass advisories.

## Existing approach
Built-in permission prompts, `PreToolUse` hooks, allow/ask/deny rules, sandboxes, and command allowlists.

## Existing limitations
Those controls can authorize the wrapper while lacking visibility into a referenced script, generated program, secondary interpreter, or equivalent action performed through another tool.

## Proposed improvement
Add a fail-closed pre-execution guard that binds approval to inspectable script content and effective risk signals. It statically inspects the outer command and referenced local scripts, hashes inspected content, returns structured `allow`/`review`/`block` decisions, and escalates ambiguous dynamic chains instead of auto-approving them.

## Architecture
- `evidence/research.md` — current evidence, existing solutions, gap and root causes.
- `skills/transitive-execution-threat-model.md` — evidence-driven investigation procedure.
- `rules/approval-boundary.md` — enforceable security invariants.
- `subagents/security-verifier.md` — independent verification role.
- `workflows/diagnose-enforce-verify.md` — bounded implementation and verification workflow.
- `hooks/pre-execution-gate.md` — integration contract for a blocking hook.
- `config/policy.json` — example secure-by-default pattern policy.
- `scripts/approval_guard.py` — dependency-free deterministic static guard.
- `tests/test_approval_guard.py` — benign, destructive, dynamic and missing-script fixtures.

## Actual package tree
```text
transitive-shell-approval-boundary-guard/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-execution-gate.md
├── rules/approval-boundary.md
├── scripts/approval_guard.py
├── skills/transitive-execution-threat-model.md
├── subagents/security-verifier.md
├── tests/test_approval_guard.py
└── workflows/diagnose-enforce-verify.md
```

## Installation
Requires Python 3.9+ and no third-party packages. Copy the directory into the host repository. Keep the host's existing sandbox, permission prompts, and protected-resource controls enabled.

## Configuration
Edit `config/policy.json`. Replace `trusted_roots` with the smallest canonical roots the agent is allowed to execute scripts from. Add organization-specific destructive/review regexes only with corresponding fixtures. `max_script_bytes` prevents silently treating large opaque scripts as safe.

## Usage
From this directory:
```sh
python3 scripts/approval_guard.py \
  --policy config/policy.json \
  --event-json '{"command":"bash scripts/build.sh","cwd":"/workspace/project"}'
```

Exit codes: `0=allow`, `10=review`, `20=block`, `30=input/policy error`. Hook hosts SHOULD block on every non-zero code and route `review` to a human-capable approval path.

Run deterministic tests:
```sh
python3 -m unittest tests/test_approval_guard.py
```

## Workflow
Use `workflows/diagnose-enforce-verify.md`: observe current behavior, capture a harmless baseline, identify the lost authorization edge, integrate the guard, rerun the same fixtures, and require independent verification.

## Metrics
Track known-bypass detection rate, benign pass rate, unresolved-chain rate, policy latency, percentage of launches with structured evidence, and high-risk auto-allow count. The target high-risk auto-allow count is zero for covered fixtures.

## Verification
### Implemented
The package provides policy, static analyzer, hook contract, fixtures, investigation procedure and independent verifier.

### Measured
Deployers must capture a before/after decision matrix using harmless fixtures before claiming improvement.

### Verified
Claim verification only when the tests pass in the target environment, configured destructive nested scripts are blocked, benign inspected scripts are allowed, unreadable/out-of-root high-risk chains fail closed, and an independent reviewer confirms no security boundary was weakened.

## Safety
This is defense-in-depth, not a sandbox. It intentionally does not execute inspected scripts. Static analysis cannot resolve every dynamic shell behavior, so ambiguous inline/encoded execution is escalated. Never add broad interpreter allow rules merely to reduce prompts. Irreversible, production, credential-bearing, or externally destructive actions require explicit human authorization in addition to this guard.

## Failure handling
Detection: non-zero exit, missing evidence, unresolved path, or failed fixture. Evidence: preserve JSON decision and hashes. Retry: maximum two implementation iterations, each with a changed hypothesis or new evidence. Fallback: keep the command blocked and use the host's human approval/sandbox path. Escalation: security owner. Stop condition: unresolved high-risk ambiguity, required privilege expansion, or need for real destructive testing.

## Definition of Done
- evidence documented and current sources linked
- baseline captured with harmless fixtures
- policy limitations identified
- guard integrated without weakening sandbox/permissions
- deterministic tests pass
- before/after decision matrix recorded
- residual risks documented
- required human approvals preserved
- independent verification complete
- no blocking security issue remains

## Customization
Extend the policy with project-specific protected actions and add a fixture for every added rule. For richer hosts, replace regex-only inspection with AST/shell-parser adapters while preserving the same fail-closed decision contract and content-digest binding.
