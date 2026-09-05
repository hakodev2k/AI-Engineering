# MCP Tool Registry Capacity Sentinel

**Category:** Thinking  
**Run date:** 2026-09-05 (UTC+7)

## Problem
Agent platforms can silently register only a subset of tools from healthy MCP connectors. A connector may report “connected” while required tools are absent, truncated at an undocumented capacity, or later disappear. The agent then plans against an incomplete capability set and can misdiagnose the failure as server, auth, or reasoning trouble.

## Evidence
See `evidence/research.md`. Current public reports include reproducible 256-tool truncation in Claude connector surfaces, a separate Gemini/Antigravity 100-tool capacity request describing silent drops, and multiple reports where connectors remain healthy while tools are unavailable.

## Existing approach and limitation
Platforms use hard tool caps, deferred loading/tool search, connector health indicators, manual refresh, or user-selected tool budgets. Explicit documented budgets are safer than silent truncation, but they still require agents and automations to know which task-critical tools are actually registered. “Connected” is not equivalent to “capability available.”

## Proposed improvement
Introduce a deterministic capability-contract sentinel. Before execution, compare the server-advertised tool inventory with the client-visible registry and a task-specific required-tool set. Detect truncation, missing required tools, unstable registry fingerprints, and capacity pressure before the planning agent commits to an execution path.

## Package tree
- `evidence/research.md`
- `skills/tool-registry-diagnosis.md`
- `rules/capability-contract.md`
- `subagents/capability-verifier.md`
- `workflows/measure-diagnose.md`
- `workflows/recover-verify.md`
- `hooks/pre-task-capability-check.md`
- `scripts/tool_registry_sentinel.py`
- `config/contract.example.json`
- `tests/test_tool_registry_sentinel.py`

## Installation
Python 3.10+, standard library only.

## Configuration
Create a JSON contract containing server-advertised tools, client-visible tools, task-required tools, and an optional documented capacity. Generate inventories from actual `tools/list` and client registry output rather than manually guessing.

## Usage
`python scripts/tool_registry_sentinel.py config/contract.example.json`

Exit 0 means required capabilities are present and registry consistency checks pass. Exit 4 means a blocking capability mismatch. Exit 1 means invalid input.

## Workflow
Observe -> measure advertised vs visible inventory -> establish baseline fingerprint -> diagnose truncation/filtering/permission/deferred-loading cause -> choose recovery -> measure again -> required tools restored? -> independent verification -> execute task.

## Metrics
Advertised tool count; visible tool count; retention ratio; required-tool coverage; registry fingerprint changes; missing-tool incidents/task; recovery attempts; time-to-capability diagnosis; false “connector healthy” states.

## Verification
**Implemented:** deterministic sentinel, rules, bounded workflows, fixtures/tests.  
**Measured:** before/after inventory counts and required-tool coverage recorded.  
**Verified:** known truncation fixtures block before planning; complete registries pass; task execution does not claim capability without observed registration.

## Safety
The sentinel never expands permissions or automatically enables dangerous tools. Reducing tool count SHOULD use explicit task-specific selection, not bypass organization policy. Enabling a high-impact tool requires the normal authorization and approval path.

## Failure handling
A missing required tool blocks task execution. Recovery gets at most 2 attempts: refresh/re-enumerate once, then apply a documented tool-selection/deferred-loading strategy or escalate. Never repeatedly refresh indefinitely. Never claim success by deleting a required capability from the contract.

## Definition of Done
Evidence documented; advertised and visible inventories captured; required tools declared; sentinel passes; capacity/filters documented; recovery bounded; task-critical tool calls verified in a safe probe; Capability Verifier signs off; no blocking mismatch remains.

## Customization
Add platform adapters to produce the same normalized contract. Keep the invariant that task-required capabilities must be observed, not inferred from connector health.