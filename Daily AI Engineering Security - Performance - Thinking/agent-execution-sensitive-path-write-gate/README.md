# Agent Execution-Sensitive Path Write Gate

**Category:** Security

## Problem
AI coding agents can ingest attacker-controlled instructions and still retain broad file-write authority. If ordinary write permission covers files that define future code execution, tool registration, IDE tasks, hooks, workflows, startup behavior, credentials, or agent policy, a prompt-influenced write can silently cross the trust boundary.

## Evidence
Current public evidence and source links are documented in `evidence/research.md`, including AWS CVE-2026-10591 and independent Kiro analysis from Intezer/Kodem.

## Existing approach
Vendor patches, human approval for shell commands, sandboxing, workspace trust, path allow/deny lists, and prompt-injection detection.

## Existing limitations
Execution approval can occur after the dangerous state change; static lists can miss tool-specific configuration; path/symlink normalization is error-prone; probabilistic prompt filtering cannot serve as authorization.

## Proposed improvement
Put a deterministic consequence-aware gate directly in front of every agent file write. Canonicalize the target, enforce workspace boundaries, classify execution-sensitive paths, require separate human approval, and fail closed.

## Architecture
```text
agent write request
  -> hooks/pre-file-write.md
  -> scripts/write_gate.py
  -> config/sensitive-paths.json
  -> allow | require_approval | block
  -> tests/test_write_gate.py
  -> independent security verification
```

## Actual package tree
```text
agent-execution-sensitive-path-write-gate/
├── README.md
├── config/sensitive-paths.json
├── evidence/research.md
├── hooks/pre-file-write.md
├── rules/write-boundary.md
├── scripts/write_gate.py
├── skills/execution-sensitive-write-analysis.md
├── subagents/security-verifier.md
├── tests/test_write_gate.py
└── workflows/write-request-verification.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Customize `config/sensitive-paths.json` for the agent host and repository conventions. Keep policy ownership separate from autonomous agent writes.

## Usage
Create a request such as:

```json
{"path":".vscode/tasks.json","workspace_root":"/work/repo","human_approved":false}
```

Run:

`python scripts/write_gate.py --request request.json --policy config/sensitive-paths.json`

## Workflow
Follow `workflows/write-request-verification.md`. Sensitive writes never self-approve; blocking conditions stop autonomous execution.

## Metrics
Sensitive-write block rate, approval coverage, outside-workspace escape detection, attack-fixture pass rate, ordinary-edit false-positive rate.

## Verification
Run `python -m unittest tests/test_write_gate.py`. A verifier distinct from the implementer must inspect security-policy changes.

## Safety
Do not include secret contents in request logs. Do not weaken workspace or approval checks to improve convenience. Treat prompt-injection detection only as a supplemental signal.

## Failure handling
**Detection:** non-zero guard exit, test failure, missing path context, or policy parse failure.  
**Evidence:** guard result and test output without secret contents.  
**Retry policy:** maximum 2 diagnostic retries.  
**Fallback:** block the write and use manual review.  
**Escalation:** security owner for unresolved sensitive-path classification.  
**Stop condition:** any approval bypass, path escape, secret exposure, or exhausted retry budget.

## Definition of Done
**Implemented:** pre-write hook and deterministic gate are integrated.  
**Measured:** attack and benign fixtures produce recorded decisions.  
**Verified:** tests pass, sensitive writes require approval or block, ordinary source writes remain functional, and an independent reviewer confirms the boundary.

## Customization
Extend sensitive patterns for IDEs, MCP clients, CI/CD, shell environments, repository hooks, and agent-specific policy files. New exemptions require explicit review.
