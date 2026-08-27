# Safety Evaluation Rules

## Purpose
Ensure safety-critical AI behaviors are evaluated explicitly before release and continuously as systems evolve.

## Scope
Applies to harmful-content handling, unsafe assistance, policy compliance, jailbreak resistance, tool misuse, and high-impact domain behaviors.

## MUST
- Safety evaluations MUST be derived from a documented threat and harm taxonomy relevant to the system.
- High-severity safety failures MUST be tracked separately from general quality metrics.
- Safety suites MUST include both normal user behavior and adversarial or boundary-seeking behavior where relevant.
- Changes to model, system prompt, tools, retrieval sources, or policy logic that can affect safety MUST trigger targeted re-evaluation.
- Safety conclusions MUST identify known blind spots and unsupported populations or scenarios.

## MUST NOT
- MUST NOT declare a system safe based only on absence of failures in a small convenience sample.
- MUST NOT suppress or relabel serious failures to improve aggregate pass rates.
- MUST NOT weaken safety thresholds to unblock a release without accountable human approval and documented risk acceptance.

## SHOULD
- Safety evaluations SHOULD include severity-weighted reporting and representative multi-turn cases.
- High-risk domains SHOULD use qualified reviewers where generic graders lack sufficient expertise.

## Exceptions
Reduced scope may be permitted for isolated low-risk changes when a documented impact analysis shows no credible safety pathway.

## Verification
Inspect threat taxonomy, test-case coverage, severity labels, change-impact records, review qualifications, failure triage, and release approvals. Reproduce selected critical cases against the release candidate.