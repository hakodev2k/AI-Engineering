# Reconnaissance Rules

## Purpose
Make reconnaissance accurate, reproducible, scope-safe, and useful for risk-driven testing.

## Scope
Covers passive discovery, active enumeration, service identification, technology fingerprinting, and attack-surface mapping.

## MUST
- MUST validate discovered assets against authorized scope before active interaction.
- MUST record discovery source, timestamp, target identifier, and confidence for material findings.
- MUST distinguish confirmed assets from inferred relationships.
- MUST tune active enumeration to the stability and sensitivity of the target.
- MUST protect reconnaissance data because inventories, versions, endpoints, and identities can be security-sensitive.

## MUST NOT
- MUST NOT actively probe third-party infrastructure merely because DNS, certificates, redirects, or dependencies reference it.
- MUST NOT present unverified fingerprinting as fact.
- MUST NOT use uncontrolled scanning rates against fragile or production-sensitive services.

## SHOULD
- SHOULD combine independent evidence sources before making architecture conclusions.
- SHOULD prioritize externally exposed, privileged, trust-boundary, and high-value surfaces.
- SHOULD preserve enough command and configuration detail for another authorized tester to reproduce discovery.

## Exceptions
Broader or higher-rate reconnaissance requires documented authorization, expected impact, monitoring, and stop criteria.

## Verification
Review scope correlation, scanner configuration, rate settings, raw evidence, target inventories, timestamps, and confidence annotations. Reproduce a sample of material discoveries independently.