# Workflow: Discover → Validate → Dispatch

## Trigger
New discovery result, AgentCard refresh/change, or routing-template change.

## Goal
Use remote capability metadata without granting it prompt authority.

## Inputs
Raw card, local policy, provenance, routing request.

## Baseline
Record whether current runtime directly interpolates remote free text and count unvalidated dispatches.

## Stages
1. **Observe** — persist raw card and SHA-256; owner: host.
2. **Measure baseline** — identify fields currently rendered and prompt channels; owner: analyst.
3. **Diagnose** — run scanner; owner: security reviewer.
4. **Form hypothesis** — identify authority-confusion path.
5. **Implement improvement** — switch to normalized data-only rendering and deterministic gate.
6. **Measure again** — run tests and sample corpus.
7. **Verify** — independent reviewer confirms no privileged interpolation.
8. **Complete** — allow dispatch only after pass.

## Tools
JSON parser, scanner, unit tests, repository search/diff.

## Outputs
Decision, findings, normalized card, metrics, verification record.

## Checkpoints
After raw capture, after scanner, after renderer change, after tests.

## Metrics
Gated dispatch %, malicious fixture block %, benign pass %, exception count.

## Retry policy
At most 2 remediation iterations for failed tests. Each retry must change an identified root cause or hypothesis.

## Stop conditions
Pass all blocking checks; explicit human-approved exception; or block/escalate after 2 failed remediation iterations.

## Failure path
Preserve evidence, disable dispatch to the affected card, and escalate. Do not fall back to raw interpolation.

## Definition of Done
100% target dispatch passes the gate, regression tests pass, reviewer signs off, and no blocking issue remains.