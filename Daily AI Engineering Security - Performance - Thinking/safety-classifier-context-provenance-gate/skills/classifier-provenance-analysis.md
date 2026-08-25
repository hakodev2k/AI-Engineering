# Skill — Classifier Provenance Analysis

## Purpose
Diagnose safety-classifier denials without weakening the safety boundary.

## Trigger
A safety/prompt-injection/malware classifier rejects a tool action, behaves inconsistently across identical retries, or becomes unavailable.

## Inputs
Action/risk; classifier-visible context segmented by origin; classifier response/request ID; policy; prior retry fingerprints.

## Preconditions
Evidence can be inspected without executing the denied tool. Secrets MUST be redacted before persistence.

## Required context
Origin, trust class, content hash, action risk, classifier status, flagged segment IDs when available.

## Allowed tools
Read-only search/log tools, `scripts/provenance_gate.py`, test runner, public documentation lookup.

## Constraints
MUST NOT disable/bypass the classifier. MUST NOT convert block/review to allow merely because content is trusted. MUST preserve evidence hashes and separate evidence from interpretation.

## Procedure
1. Capture action and risk.
2. Split effective context into system control, plugin/hook, user, retrieval/tool output, and memory segments.
3. Run the provenance gate for stable IDs/hashes.
4. Attach classifier result and flagged IDs.
5. Any flagged user/untrusted segment remains blocked.
6. Trusted-control-only flag routes to independent review; never auto-approve.
7. Classifier unavailable follows risk fallback.
8. Compare evidence fingerprint to prior attempt; stop unchanged retries when budget is exhausted.
9. Record Facts, Evidence, Assumptions, Interpretation, Decision, Risks, Verification status.

## Decision points
Missing provenance → block/review. Unknown flagged ID → invalid evidence. Trusted-control-only flag → review. User/untrusted flag → block. Unavailable classifier → policy fallback.

## Expected output
Machine-readable gate record and provenance-resolved incident note.

## Metrics
Denials/100 calls; provenance-resolution rate; identical retries; manual reviews; unavailable rate; p95 gate latency.

## Verification
`python -m unittest discover -s tests -v` and confirm untrusted fixtures block while trusted-control false-positive fixtures require review.

## Failure handling
Malformed evidence stops analysis with denial preserved. Missing classifier IDs remain explicitly unresolved.

## Stop conditions
Evidence supports a decision, retry budget is exhausted, or human review is required.
