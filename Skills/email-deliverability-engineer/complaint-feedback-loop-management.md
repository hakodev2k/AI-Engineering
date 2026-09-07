# Complaint and Feedback Loop Management

## Purpose
Capture spam complaints quickly, suppress affected recipients, identify abusive or low-quality acquisition sources, and protect sender reputation.

## When to use
Use when integrating complaint feeds, investigating complaint spikes, or defining campaign/list quality controls.

## Inputs
Feedback-loop events, provider complaint telemetry, message/campaign identifiers, consent source, recipient state, and sending identity.

## Preconditions
Complaint events must be attributable to the original send and suppression must propagate across relevant senders.

## Context to inspect
Inspect mailbox-provider feedback mechanisms, complaint rate denominators, cohort/source quality, unsubscribe UX, frequency, and recent targeting changes.

## Core knowledge
Complaint rates are strong negative reputation signals. Not all providers expose recipient-level feedback. A complaint is operational evidence that future non-essential mail to that recipient should stop, even if a legal consent record exists.

## Procedure
1. Ingest provider complaint events with raw metadata.
2. Suppress the complained recipient from applicable future traffic immediately.
3. Correlate complaint spikes with acquisition source, campaign, segment, frequency, and identity.
4. Compare provider-specific rates against historical baselines.
5. Inspect unsubscribe accessibility and preference handling.
6. Pause or tighten the highest-risk source before broad infrastructure changes.
7. Remediate consent, expectation, targeting, or frequency causes.
8. Verify suppression propagation across providers and applications.
9. Monitor recovery and recurring source patterns.

## Decision points
Preserve security-critical mail only when product/legal policy explicitly distinguishes it from suppressible messaging. Treat provider-specific thresholds as dynamic; use internal warning levels below known enforcement ranges.

## Common failure patterns
Counting complaints without denominator, delayed suppression, treating complaints as merely content feedback, resending from another provider, and ignoring acquisition-source concentration.

## Verification
Trace sampled complaints end-to-end, confirm future suppressible sends are blocked, validate provider-level rate trends, and verify root-cause remediation.

## Expected output
A complaint handling workflow with source-level diagnostics, suppression evidence, and preventive actions.

## Stop conditions
Stop affected bulk traffic when complaint rates materially exceed safe baselines or complaint events cannot be reliably suppressed.