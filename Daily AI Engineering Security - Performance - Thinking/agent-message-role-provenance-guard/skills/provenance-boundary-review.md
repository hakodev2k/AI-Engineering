# Skill: Provenance Boundary Review

## Purpose
Review how an agent runtime converts human, system, model, tool, subagent, memory, and advisor events into model-context roles.

## Trigger
Use when adding/changing tool relays, subagents, advisor calls, memory injection, transcript replay, context compaction, or message serialization.

## Inputs
Message schema, context assembly code/path, sample normalized traces, role/source policy, sensitive-tool boundaries.

## Preconditions
The runtime can expose message source metadata without revealing secrets; tests can run on synthetic payloads.

## Required context
Which component authenticates human input; which component owns system instructions; all relay/transform boundaries; what content is considered untrusted.

## Allowed tools
Read-only trace inspection, source/config inspection, `scripts/validate_message_provenance.py`, unit tests, safe synthetic fixtures.

## Constraints
Do not execute payloads. Do not access real secrets to prove exfiltration. Do not rely on model refusal as enforcement.

## Procedure
1. Enumerate source types and all possible output roles.
2. Build a source→allowed-role table.
3. Identify every serialization, relay, summarization, compaction, and replay boundary.
4. Capture a benign trace and confirm provenance survives each hop.
5. Inject synthetic tool/subagent strings that imitate user/system instructions and protected control markup.
6. Run the deterministic validator before model dispatch.
7. If a violation is found, fix the assembly/relay mapping rather than adding prompt wording.
8. Re-run fixtures and a normal workload.
9. Have an independent verifier confirm privileged-role messages originate only from trusted sources.

## Decision points
- Missing origin/source metadata: block privileged context assembly.
- Tool/subagent output mapped to user/system: security failure.
- Protected markup in untrusted content: escape/quarantine/reject before dispatch.
- Classifier catches payload but deterministic provenance fails: still a security failure.

## Expected output
Source-role matrix, violating message IDs, affected relay boundary, remediation evidence, verification status.

## Metrics
Invariant violations, provenance coverage, blocked impersonation attempts, unclassified source percentage, false positives.

## Verification
Verified only when deterministic tests pass and a representative runtime trace has 100% provenance coverage for privileged roles.

## Failure handling
Quarantine offending messages, disable only the unsafe relay path when possible, preserve evidence, and require human review before re-enabling privileged operations.

## Stop conditions
Stop immediately on any privileged-role provenance violation. Remediation attempts are capped at 3 distinct fixes before escalation.
