# Threat Modeling

## Purpose
Use explicit threat analysis to drive cloud security decisions.

## Scope
New systems, material architecture changes, sensitive integrations, and high-risk cloud capabilities.

## MUST
- Threat models MUST identify assets, actors, trust boundaries, entry points, abuse cases, and security assumptions.
- Material threats MUST map to preventive, detective, or recovery controls and an accountable owner.
- Residual high risk MUST be explicitly accepted by authorized humans before production exposure.
- Threat models MUST be revisited when trust boundaries or sensitive data flows materially change.

## MUST NOT
- MUST NOT treat a compliance checklist as a substitute for threat analysis.
- MUST NOT omit privileged, supply-chain, insider, or cloud-control-plane abuse paths when relevant.

## SHOULD
- Prioritize plausible, high-impact scenarios over exhaustive low-value enumeration.
- Link threat assumptions to tests or observable evidence.

## Exceptions
If formal modeling is disproportionate, record a lightweight analysis, rationale, affected risks, and reviewer.

## Verification
Review diagrams and threat records against deployed architecture; sample threats and verify mapped controls and evidence exist.