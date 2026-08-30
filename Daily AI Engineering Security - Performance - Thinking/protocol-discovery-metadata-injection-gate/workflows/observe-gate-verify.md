# Observe → Gate → Verify Workflow

## Trigger
New/changed remote MCP server, A2A AgentCard, tool registry metadata, protocol upgrade, or suspicious action trace.

## Goal
Keep protocol discovery useful while preventing remote metadata from becoming trusted control instructions.

## Inputs
Raw discovery payloads, endpoint identity, policy, task intent, action traces.

## Baseline
Capture current behavior before changes: which fields enter prompts, current action allowlist, whether metadata can influence high-impact actions, and existing audit coverage.

## Context
Use `evidence/research.md`, `skills/discovery-metadata-threat-audit.md`, and `rules/untrusted-discovery-metadata.md`.

## Stages
1. **Observe** — reproduce benign discovery and at least four malicious metadata fixtures. Responsible: implementation owner. Output: baseline evidence.
2. **Diagnose** — map field provenance, prompt channel, and authorization decision points. Responsible: security reviewer for independent confirmation.
3. **Hypothesis** — state a falsifiable claim, e.g. “data-only wrapping plus external allowlist prevents metadata-driven permission expansion.”
4. **Implement gate** — configure and run `scripts/discovery_metadata_guard.py`; integrate its envelope before prompt construction.
5. **Measure again** — rerun the identical fixtures and compare admitted fields, findings, and action decisions.
6. **Verify** — independent reviewer confirms invariants and runs unit tests.

## Tools
JSON/schema validation, guard script, unit tests, prompt-construction inspection, local permission-policy evaluator.

## Outputs
Baseline record, guarded envelopes, finding reports, before/after action outcomes, verification decision.

## Checkpoints
- C1: provenance map complete;
- C2: local allowlist captured before implementation;
- C3: adversarial fixtures fail safely;
- C4: benign metadata remains usable;
- C5: independent review complete.

## Metrics
Unauthorized governed actions; benign preservation; false-positive count; policy coverage; audit coverage.

## Retry policy
Maximum 2 implementation/measurement retries. Each retry requires a new root-cause hypothesis tied to evidence.

## Stop conditions
Stop on unresolved permission expansion, missing provenance, test failure, or need for human approval. Stop successfully only when all checkpoints pass.

## Failure path
Restore last known-good prompt/permission configuration, quarantine the server/AgentCard, retain non-secret evidence, and escalate to a human security owner.

## Verification
Run `python -m unittest tests/test_discovery_metadata_guard.py` and independently inspect that the action allowlist is policy-derived, not metadata-derived.

## Definition of Done
Baseline and attack path documented; gate implemented; malicious cases blocked from instruction authority; benign discovery retained; tests pass; permission boundaries unchanged; reviewer approves; no blocking issue remains.
