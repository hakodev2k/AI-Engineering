# Fault Model Rules
## Purpose
Inject failures that represent plausible system risks.
## Scope
Latency, loss, dependency failure, resource exhaustion, process failure, and infrastructure faults.
## MUST
- Map each fault to a credible failure mode and affected architecture boundary.
- Define fault intensity, duration, and cleanup behavior.
## MUST NOT
- Assume random disruption provides meaningful coverage.
- Misrepresent synthetic faults as equivalent to real incidents without evidence.
## SHOULD
- Derive fault models from incidents, architecture, and threat/risk analysis.
## Exceptions
Novel fault exploration is acceptable in isolated environments with documented learning goals.
## Verification
Review architecture mapping, incident evidence, fault parameters, and cleanup.