# Skill — Review Message Provenance

## Purpose
Determine whether every authority-bearing message in an agent runtime has authenticated, preserved provenance and whether untrusted content can cross into a privileged channel.

## Trigger
Use for new chat gateways, subagent relays, tool-result adapters, prompt compaction changes, resume/persistence changes, or any incident involving unexpected user/system instructions.

## Inputs
Message schema, ingress/relay code paths, trusted source inventory, representative event logs, and regression fixtures.

## Preconditions
Read-only inspection is sufficient for diagnosis. Do not run project-controlled commands or expose secrets.

## Required context
Identify all producers, serializers, queues, persistence layers, normalizers, and final model-role mappings.

## Allowed tools
Repository search/read, schema inspection, log analysis with redaction, and `scripts/authority_gate.py`.

## Constraints
Do not infer trust from names or plaintext tags. Do not weaken authorization to make tests pass.

## Procedure
1. Inventory every producer capable of emitting events that become `user` or `system` roles.
2. For each producer record source identity, authentication mechanism, authority assigned, correlation identifier, and persistence behavior.
3. Trace one message end-to-end through serialization, queue/retry, compaction/resume, and model rendering.
4. Create adversarial fixtures where assistant/tool/subagent text contains user/system-looking markers.
5. Run the deterministic gate and verify privileged promotions block.
6. Inspect any normalization step that drops source/authentication fields.
7. Form a concrete hypothesis for each boundary failure and implement the smallest fix at the earliest trustworthy layer.
8. Re-run malicious and legitimate fixtures; require an independent reviewer for boundary changes.

## Decision points
If trusted provenance cannot survive a component, keep the event as data or reject it. If the business flow requires promotion, add a cryptographically/authentically bound adapter rather than a prompt convention.

## Expected output
Source-to-authority mapping, identified boundary violations, proposed code/config change, and verification evidence.

## Metrics
Provenance coverage, blocked unauthorized promotions, spoof-marker detections, legitimate-message false positives, and regression pass rate.

## Verification
The implementing agent is not the sole verifier; `subagents/security-verifier.md` independently checks invariants and tests.

## Failure handling
On ambiguous provenance, fail closed and retain evidence. Maximum remediation/test cycles: 3. Escalate unresolved production compatibility to a human security owner.

## Stop conditions
Stop when all authority paths have authenticated provenance, adversarial fixtures block, legitimate fixtures pass, and independent verification succeeds; or after 3 failed cycles with documented blockers.
