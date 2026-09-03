# MCP Process Lifecycle Leak Guard

## Topic
Bounded ownership and cleanup for local MCP server processes across agent session lifecycle transitions.

## Category
Performance

## Problem
Local stdio MCP servers can be duplicated or orphaned across resume, fork, reconnect, reload, and shutdown paths. Over time this can increase CPU/RAM, duplicate network clients, contend on singleton resources, and slow unrelated shell/build/test work.

## Evidence
See `evidence/research.md` for current public reports from Codex and Claude Code, including August 2026 resume/session-lifecycle failures.

## Existing approach
Agent hosts commonly rely on parent-child process teardown, transport closure, signal handlers, or manual restarts. Those mechanisms are incomplete when the app-server remains alive while logical sessions and MCP generations are replaced.

## Existing limitations
PID-level observation alone cannot distinguish intended concurrency from duplicate ownership; UI MCP state can omit processes; transport close does not prove OS-process exit; aggressive cleanup can terminate unrelated work.

## Proposed improvement
Normalize every MCP process into an observable logical identity and audit four invariants: owner exists, generations are bounded, stale ownerless processes become orphans after grace, and repeated lifecycle cycles return to the same steady state.

## Architecture
```text
process/session snapshot
        |
        v
scripts/mcp_process_audit.py <--- config/policy.json
        |
        +--> machine-readable metrics/findings
        |
        v
workflow + blocking completion hook
```

## Package tree
```text
mcp-process-lifecycle-leak-guard/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-completion-lifecycle-check.md
├── rules/lifecycle-invariants.md
├── scripts/mcp_process_audit.py
├── skills/process-lifecycle-baseline.md
├── subagents/performance-investigator.md
├── tests/test_mcp_process_audit.py
└── workflows/measure-diagnose-remediate.md
```

## Installation
Python 3.9+ only; no third-party dependencies are required. Copy the directory and integrate a host-specific read-only process snapshot producer.

## Snapshot contract
`--snapshot` accepts JSON with `live_owner_ids` and `processes`. Each process requires positive integer `pid`; recommended fields are `command`, `owner_id`, `server_identity`, `scope_key`, `host_instance`, `age_seconds`, `state`, or a precomputed `identity`.

## Configuration
Tune `config/policy.json` only to encode legitimate server sharing semantics. Do not raise thresholds merely to make a regression pass.

## Usage
```bash
python scripts/mcp_process_audit.py --snapshot snapshot.json --policy config/policy.json --output report.json
python -m unittest tests/test_mcp_process_audit.py
```
Exit code 0 means policy pass, 2 means lifecycle violations, and 3 means invalid input/configuration or output failure.

## Workflow
Follow `workflows/measure-diagnose-remediate.md`: Measure baseline → Diagnose → Hypothesize → Implement → Measure again → independently verify. Retry remediation at most three times.

## Metrics
MCP process count, logical identity count, duplicate identity count, maximum active generations, orphan count, oldest orphan age, and optional externally supplied RSS/CPU totals.

## Verification
The same resume/fork/reconnect/close sequence must converge to the same bounded process steady state, audit status must be `pass`, and unit tests must pass.

## Safety
The reference script is read-only and never terminates processes. Any destructive cleanup requires positive ownership evidence and explicit operator approval.

## Failure handling
Detection: audit violation or non-convergent process count. Evidence: retain snapshots, identities, PIDs, logs, and trigger sequence. Retry: maximum three distinct remediation attempts. Fallback: roll back lifecycle changes and leave uncertain processes untouched. Escalation: ownership ambiguity or persistent leak. Stop: destructive cleanup without approval, three failed iterations, or legitimate concurrency regression.

## Definition of Done
- **Implemented:** ownership/reaping improvement is present.
- **Measured:** equivalent before/after lifecycle snapshots and metrics exist.
- **Verified:** independent repetition passes policy and tests with no legitimate MCP process loss.
- Evidence documented and remaining risks recorded.
- No blocking issue remains.

## Customization
Adapters may add platform-specific snapshot collection for Windows Job Objects, Unix process groups, containers, or service managers while preserving the normalized snapshot contract and read-only default behavior.
