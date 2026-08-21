# Skill: Claim Decomposition

## Purpose
Turn a research question or draft conclusion into atomic claims that can be independently supported, contradicted, or left unresolved.

## When to use
Use before evidence collection and whenever a reviewer flags a compound or vague statement.

## Inputs
- research question or decision
- known constraints
- candidate conclusion, if one exists
- repository or domain context

## Preconditions
- decision scope is known
- no final recommendation is locked in

## Process
1. State the decision the research must support.
2. Extract every material factual assertion.
3. Split compound statements so each claim has one truth condition.
4. Mark each claim as `fact`, `capability`, `compatibility`, `performance`, `security`, `policy`, `cost`, `risk`, or `inference`.
5. Mark impact as `low`, `medium`, or `high`.
6. Write a falsification question: what evidence would prove the claim wrong?
7. Define required evidence strength. High-impact claims should prefer primary sources and independent corroboration when feasible.
8. Record scope qualifiers such as version, platform, environment, region, date, or configuration.
9. Give every claim a stable ID such as `CLM-001`.
10. Do not merge unresolved claims into a recommendation.

## Allowed tools
Repository search, web/search tools, official documentation, papers, issue trackers, release notes, logs, and read-only data sources appropriate to the task.

## Constraints
- Do not turn assumptions into facts.
- Do not hide qualifiers.
- Do not use one broad claim to represent multiple independently falsifiable statements.

## Expected output
Atomic claims ready for the claim-evidence matrix.

## Verification
A claim is well-formed when another reviewer can answer: what exactly is asserted, in what scope, and what evidence would contradict it?

## Failure handling
If scope is ambiguous, mark the claim `unresolved` and record the missing decision instead of guessing.

## Stop conditions
Stop decomposition when all material assertions are atomic and scoped, or when missing user/stakeholder input prevents further decomposition.