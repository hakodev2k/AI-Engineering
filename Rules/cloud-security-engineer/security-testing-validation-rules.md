# Security Testing and Validation

## Purpose
Require evidence that cloud security controls work as intended.

## Scope
Configuration tests, policy tests, penetration testing, attack simulation, control validation, and regression checks.

## MUST
- Security-critical controls MUST have a practical verification method proportional to risk.
- Tests MUST distinguish configured intent from effective behavior.
- High-risk fixes MUST include regression evidence where feasible.
- Intrusive production testing MUST have explicit scope, safety controls, and human authorization.

## MUST NOT
- MUST NOT claim a security issue is fixed based only on code or template changes when deployed behavior can be verified.
- MUST NOT run disruptive attack simulations against production without authorization.
- MUST NOT treat scanner absence of findings as proof of complete security.

## SHOULD
- Automate deterministic checks in CI or continuous posture validation.
- Include negative tests for denied access and blocked exposure.

## Exceptions
Document why direct testing is unsafe or infeasible, alternative evidence, residual uncertainty, and reviewer.

## Verification
Review test definitions, execution results, effective-policy checks, attack-simulation evidence, regression coverage, scope authorization, and unresolved failures.