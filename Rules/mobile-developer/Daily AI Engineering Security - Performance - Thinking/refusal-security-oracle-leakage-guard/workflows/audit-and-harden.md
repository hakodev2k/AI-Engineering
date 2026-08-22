# Workflow: Audit and Harden Refusal Leakage

## Trigger
Release candidate, model/gateway change, or refusal-leak incident.

## Goal
Measure and reduce exploit-relevant information exposed by denials.

## Inputs
Probe corpus, policy, sensitive inventory, build/version identifiers.

## Baseline
Run corpus once and store response hashes, scanner findings, statuses, and latency buckets before changes.

## Stages
1. **Observe** — collect representative denials and metadata.
2. **Measure baseline** — compute leak counts and cross-denial variance.
3. **Diagnose** — map leaks to model context, templates, middleware, or transport behavior.
4. **Form hypothesis** — one falsifiable root-cause statement per change.
5. **Implement improvement** — minimize sensitive context or normalize response behavior.
6. **Measure again** — replay identical corpus.
7. **Improved?** If no, revise hypothesis; maximum 3 remediation cycles.
8. **Independent verification** — Refusal Security Reviewer replays high-severity and neighboring probes.
9. **Complete** — archive evidence and release decision.

## Responsible agent
Implementer for stages 3–6; independent reviewer for stage 8.

## Tools
Scanner, test harness, response metadata recorder, unit tests.

## Outputs
Baseline report, remediation evidence, regression report, reviewer decision.

## Checkpoints
After baseline, before behavior-changing mitigation, and before release.

## Metrics
Known-sensitive leaks, pattern leaks, multi-turn reconnaissance gain, false positives, explanation quality, latency/status variance.

## Retry policy
At most 3 remediation hypotheses. Each retry must change the hypothesis or implementation; identical retries are prohibited.

## Failure path
If still leaking after 3 cycles, block release for high severity or require explicit security-owner risk acceptance for lower severity.

## Verification
Run `python -m unittest discover tests -v` plus the product-specific multi-turn corpus.

## Definition of Done
Evidence documented; baseline measured; identified leak is removed or accepted; tests pass; independent reviewer verifies high-severity cases; no real secrets were used.
