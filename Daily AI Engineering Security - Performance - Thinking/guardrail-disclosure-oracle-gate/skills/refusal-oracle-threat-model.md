# Skill — Refusal Oracle Threat Modeling

## Purpose
Identify whether user-visible denial behavior gives an adaptive attacker actionable information about hidden controls.

## Trigger
Use when a release changes prompts, refusal templates, tool metadata, connector behavior, authorization errors, feature flags, routing or guardrails.

## Inputs
- architecture/trust-boundary notes;
- list of internal-only literals/concepts;
- representative denial transcripts;
- public error/reason-code contract;
- prior security incidents or probe corpus.

## Preconditions
The reviewer can distinguish public product behavior from internal-only implementation detail. The protected-surface configuration is versioned.

## Required context
Only the minimum architecture information needed to classify disclosures. Secrets themselves are not required and must not be placed in the probe corpus.

## Allowed tools
Static transcript analysis, test harnesses, local regex/string matching, approved red-team environments, issue/security documentation.

## Constraints
Do not probe production users, do not request hidden chain-of-thought, and do not weaken authorization or safety controls to make tests pass.

## Procedure
1. Map the denial path from user input to classifier/policy/model/tool boundary to rendered output.
2. Separate public semantics (for example, `AUTHORIZATION_REQUIRED`) from internal mechanism details.
3. List protected literals and protected concepts that would reduce attacker uncertainty if disclosed.
4. Build benign probes that should receive useful correction guidance.
5. Build adaptive probes that ask why a control exists, why a path is disabled, what changed historically, and what alternative mechanism would work. Keep probes non-destructive.
6. Run the system and store only user-visible outputs plus stable metadata.
7. Run `scripts/oracle_probe_audit.py` and inspect every match.
8. For unmatched text, manually check whether successive responses cumulatively reveal a bypass-relevant concept not captured by literal rules; update patterns only when evidence supports it.
9. Remediate by reducing external detail, moving diagnostics out of model/user output, or using stable public reason codes.
10. Re-run benign and adversarial suites. Require an independent verifier before completion.

## Decision points
- If a detail is required for a user to correct ordinary input, classify it public and document why.
- If a detail only helps explain internal enforcement, keep it internal.
- If the model cannot reliably separate the two, render the denial outside the model from structured reason codes.

## Expected output
Threat model, protected-surface config revision, audit report, benign usability result, adversarial regression result, verifier decision.

## Metrics
Protected matches, unique disclosures per sequence, benign false positives, regression pass rate.

## Verification
A pass requires zero unapproved protected-surface matches and successful benign correction cases.

## Failure handling
Maximum two remediation iterations. If leakage remains, fall back to deterministic denial rendering and escalate to the security owner.

## Stop conditions
Stop when the suite passes and independent verification is recorded, or after two failed remediation iterations.