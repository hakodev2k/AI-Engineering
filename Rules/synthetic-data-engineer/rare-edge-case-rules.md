# Rare and Edge Case Rules

## Purpose
Ensure synthetic datasets deliberately cover important low-frequency conditions without distorting normal behavior.

## Scope
Applies to rare classes, boundary conditions, failure scenarios, unusual combinations, safety-critical cases, and low-prevalence populations.

## MUST
- Identify consequential rare cases from domain risk, incident history, requirements, and downstream failure analysis.
- Distinguish naturally rare cases from impossible cases and generated anomalies.
- Define target coverage for required edge cases and verify that generated examples remain semantically valid.
- Record intentional oversampling so downstream consumers do not mistake synthetic prevalence for real-world prevalence.
- Test models or systems separately on rare-case subsets when those cases carry disproportionate risk.

## MUST NOT
- Assume random generation will adequately cover safety-critical tails.
- Inflate rare cases without documenting prevalence changes and downstream weighting expectations.
- Create unrealistic combinations merely to increase edge-case counts.
- Remove difficult rare cases because they lower aggregate quality metrics.

## SHOULD
- Use incident records, hazard analyses, expert elicitation, and boundary-value analysis to discover missing scenarios.
- Maintain dedicated rare-case regression suites.
- Review edge-case coverage when requirements, systems, or environments change.

## Exceptions
A required rare case may be omitted only with documented infeasibility, risk assessment, compensating validation, and appropriate approval.

## Verification
Inspect edge-case manifests, coverage metrics, semantic validators, prevalence metadata, downstream subset results, and traceability to risk or requirement sources.