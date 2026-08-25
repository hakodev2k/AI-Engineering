# Skill: Control-Channel Threat Modeling

## Purpose
Identify where model-authored or external text can cross into a privileged agent control channel and define a deterministic enforcement point before prompt assembly.

## Trigger
Use when a runtime introduces subagents, background tasks, tool-result wrappers, system reminders, notifications, steering messages, or any other control text that shares context with untrusted payloads.

## Inputs
- Message/control-channel architecture.
- Producer list and trust levels.
- Prompt-assembly code or message schema.
- Reserved control markers and parser behavior.
- Existing integrity/authentication mechanism.

## Preconditions
The reviewer can identify the component that assigns message role/privilege and the component that serializes data into model context.

## Required context
Document producer, transport, parser, trust decision, and consumer for every privileged message type. Treat subagent-generated final text as untrusted unless a non-model runtime component asserts provenance.

## Allowed tools
Static code search, schema inspection, trace/log review, unit/integration tests, local fixtures, and the package scanner.

## Constraints
- Do not execute untrusted payloads during analysis.
- Do not classify authenticity from wording or model confidence.
- Do not weaken existing permission or sandbox controls.
- Do not require hidden chain-of-thought.

## Procedure
1. Enumerate message classes and mark each as runtime-authored, user-authored, model-authored, tool-authored, or external.
2. Locate every conversion where one class becomes another or where multiple origins are concatenated.
3. Record reserved markers and all code paths that assign elevated meaning to them.
4. Attempt the invariant violation: place each reserved marker inside every untrusted payload type and trace whether it reaches a privileged parser unchanged.
5. If privilege can be gained from text shape, classify the boundary as vulnerable.
6. Design the enforcement point before concatenation: preserve origin metadata, escape/reject reserved markers in untrusted data, and require runtime-issued provenance for privileged envelopes.
7. Add positive and negative fixtures, including tampered provenance.
8. Re-run with the parent model disabled where possible to prove the gate is deterministic rather than model-dependent.

## Decision points
- **Reserved marker in untrusted data:** escape or block before prompt assembly.
- **Privileged envelope without runtime provenance:** block.
- **Mixed-origin concatenation before validation:** redesign boundary; do not compensate only with prompt wording.
- **Benign documentation containing a marker:** prefer escaping/data encoding over destructive removal.

## Expected output
A trust-boundary map, vulnerable transitions, chosen enforcement point, explicit invariants, fixture set, and verification result.

## Metrics
Coverage of privileged message types, number of provenance-loss transitions, blocked spoof fixtures, false positives, and untrusted-to-privileged transitions after remediation.

## Verification
A reviewer must demonstrate that identical bytes receive different privilege only because of runtime metadata, never because the text resembles a control message.

## Failure handling
Capture the exact producer, payload, transition, and parser. Retry analysis once after correcting missing instrumentation. If provenance cannot be preserved through the host, stop and escalate; do not mark the boundary safe.

## Stop conditions
Stop when all privileged channels have deterministic origin checks and all known spoof fixtures fail closed, or when the host architecture cannot preserve provenance and requires redesign.
