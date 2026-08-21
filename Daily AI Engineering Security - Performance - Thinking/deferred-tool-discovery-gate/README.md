# Deferred Tool Discovery Gate

**Category:** Thinking

## Problem
Agents with large deferred tool catalogs can incorrectly conclude that a capability is unavailable because it is absent from the currently loaded tool list. The failure is silent: the agent may ask the user, invent a workaround, or decline even though a discoverable capability exists.

## Evidence
See `evidence/research.md`. Recent Claude Code reports document missed deferred-tool acquisition and lost deferred schemas after compaction.

## Existing approach
Projects commonly rely on always-loaded instructions, model-initiated ToolSearch, or eager schema loading.

## Existing limitations
Rules do not prove discovery happened, eager loading increases context, and deferred acquisition can be forgotten or lost across lifecycle boundaries.

## Proposed improvement
Place a deterministic gate immediately before terminal capability decisions. Match the task against a compact registry; if a relevant deferred capability has not been searched or ruled out, require one bounded discovery pass before declining or improvising.

## Architecture
```text
task + pending terminal decision
  -> compact capability registry
  -> discovery_gate.py
  -> allow: terminal decision has evidence
  -> discover: targeted ToolSearch
       -> record outcome
       -> rerun gate
  -> review: Capability Verifier
```

## Actual package tree
```text
deferred-tool-discovery-gate/
├── README.md
├── evidence/research.md
├── config/capabilities.json
├── skills/pre-decline-capability-discovery.md
├── rules/discovery-rules.md
├── subagents/capability-verifier.md
├── workflows/pre-decline-discovery.md
├── hooks/pre-terminal-capability-decision.md
├── scripts/discovery_gate.py
└── tests/test_discovery_gate.py
```

## Installation
Requires Python 3.10+. Copy the package into the repository/harness containing your agent instructions.

## Configuration
Edit `config/capabilities.json` with stable capability IDs, short intent phrases, and narrow discovery queries. Keep this index compact; do not duplicate full tool schemas.

## Usage
```bash
python scripts/discovery_gate.py \
  --registry config/capabilities.json \
  --task "Find this in a prior session" \
  --decision decline \
  --loaded "" \
  --searched ""
```
Exit `2` means a relevant capability has not yet been searched. Exit `0` permits the terminal decision from this gate's perspective. Exit `3` requires review.

## Workflow
Follow `workflows/pre-decline-discovery.md`. Discovery does not authorize tool execution; discovered tools still pass ordinary permissions, trust, and safety checks.

## Metrics
- discovery coverage before terminal capability decisions;
- loaded-vs-deferred acquisition rate;
- prevented false limitation claims;
- unnecessary user prompts/workarounds;
- false-positive blocks;
- discovery latency and token overhead.

## Verification
```bash
python -m unittest tests/test_discovery_gate.py
```
Also run an A/B task battery with the same required capability loaded in one arm and deferred behind discovery in the other.

## Safety
The supplied script reads only local JSON/text arguments and emits a decision. It never invokes discovered tools or changes permissions.

## Failure handling
Registry parse/read failure returns exit `3`; retry deterministic collection once and then require human/verifier review rather than converting unknown capability state into `unavailable`.

## Definition of Done
- current public evidence documented;
- compact registry configured;
- gate runs before eligible terminal decisions;
- discovery retries bounded to two passes;
- ambiguous cases independently reviewed;
- tests pass;
- baseline and post-deployment acquisition/false-claim metrics are collected;
- no tool authorization boundary is weakened.

## Implemented / Measured / Verified
**Implemented:** package artifacts and deterministic gate.

**Measured:** requires adopter telemetry/A-B evaluation.

**Verified:** requires passing tests plus evidence that unsupported capability claims decrease without unacceptable false-positive blocking.

## Customization
Extend decision classes, add richer intent matching, or replace phrase matching with a local classifier. Preserve the invariant that classifier uncertainty must not silently become `capability unavailable`.