# Security Response Rules
## Purpose
Handle browser vulnerabilities with containment, evidence, coordinated remediation, and controlled disclosure.
## Scope
Security bug triage, exploitability assessment, patching, backporting, and release coordination.
## MUST
- Suspected vulnerabilities MUST preserve evidence and be handled under the applicable restricted process.
- Fixes MUST address the violated invariant, not only the known proof of concept.
- Patch scope and backport decisions MUST consider exploitability, affected versions, regression risk, and exposure.
## MUST NOT
- MUST NOT publish exploit-enabling details before authorized disclosure.
- MUST NOT downgrade severity merely because exploitation has not been observed.
## SHOULD
- SHOULD add safe regression coverage and search for variant bugs.
## Exceptions
Disclosure or mitigation deviations require explicit security leadership approval.
## Verification
Use root-cause review, variant analysis, regression tests, sanitizer/fuzzer validation, patch diff review, and release confirmation.