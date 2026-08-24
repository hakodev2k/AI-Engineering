# Workflow: Observe → Map → Test → Enforce → Verify

## Trigger
A runtime adds or changes a message relay, subagent, advisor, tool, memory, transcript replay, or context-assembly layer.

## Goal
Ensure message authority comes from authenticated provenance, never from text formatting or model-generated content.

## Inputs
Normalized message trace, source-role policy, context assembly path, synthetic attack fixtures.

## Baseline
Capture a normal session and record every message's role, source type, trust flag, origin ID, and relay hops before changing enforcement.

## Stages
1. **Observe:** enumerate actual message sources and context roles.
2. **Map:** document allowed source→role mappings and privileged-role owners.
3. **Diagnose:** locate boundaries where origin/trust metadata is dropped or recomputed from content.
4. **Hypothesize:** select one boundary correction.
5. **Implement:** preserve provenance, constrain role mapping, and quarantine protected markup from untrusted sources.
6. **Adversarial test:** replay synthetic user/system impersonation from tool/subagent/model sources.
7. **Normal regression test:** confirm legitimate tool/subagent outputs remain usable.
8. **Verify:** independent reviewer checks the trace and deterministic results.

## Responsible agent
Security implementer fixes the relay; an independent security verifier owns final acceptance.

## Tools
Runtime trace/log export, source inspection, `validate_message_provenance.py`, unit tests.

## Outputs
Source-role matrix, baseline, violation evidence, remediated trace, regression results, verification decision.

## Checkpoints
- CP1: all privileged-role owners explicitly identified.
- CP2: 100% privileged messages have stable provenance.
- CP3: synthetic tool/subagent user-role injection is blocked.
- CP4: protected-control markup from untrusted sources is blocked/quarantined.
- CP5: normal tool results remain available without privilege promotion.

## Metrics
Privileged-role provenance coverage; violations/session; unclassified sources; blocked impersonation fixtures; false positives; sensitive actions dependent on untrusted instructions.

## Retry policy
Maximum 3 remediation iterations. Every retry must target a different identified boundary or mapping defect.

## Stop conditions
Any unresolved privileged-role violation, missing provenance on a privileged message, regression that weakens authorization, or three failed remediation attempts.

## Failure path
Disable/quarantine only the unsafe relay path when possible; retain the trace; require human approval before restoring sensitive operations.

## Verification
Implemented = provenance fields and source-role mapping exist. Measured = baseline/adversarial traces exist. Verified = all deterministic security fixtures pass, privileged provenance is complete, authorization boundaries remain intact, and an independent reviewer signs off.

## Definition of Done
Current evidence documented; trust boundaries mapped; root cause identified; deterministic enforcement implemented; attack fixtures blocked; legitimate flows pass; no secrets used in testing; independent verification complete.
