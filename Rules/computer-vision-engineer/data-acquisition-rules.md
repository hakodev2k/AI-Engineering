# Data Acquisition Rules

## Purpose
Ensure training and evaluation imagery is legally usable, representative, traceable, and fit for the intended vision task.

## Scope
Image, video, sensor, annotation-source, synthetic, and third-party datasets.

## MUST
- Dataset sources MUST record provenance, collection conditions, permitted uses, and applicable retention constraints.
- Acquisition plans MUST define target environments, populations, devices, viewpoints, lighting, and known edge conditions relevant to deployment.
- Material distribution gaps MUST be documented before model acceptance.
- Sensitive or regulated data MUST follow applicable consent, minimization, access, and retention requirements.

## MUST NOT
- Data MUST NOT be scraped, purchased, or reused when licensing or consent is unresolved.
- Convenience samples MUST NOT be represented as deployment-representative without evidence.

## SHOULD
- Collection SHOULD intentionally cover rare but safety- or business-critical scenarios.
- Synthetic data SHOULD complement rather than silently replace required real-world evidence.

## Exceptions
Exceptions require documented purpose, provenance, risk, alternatives considered, validation plan, and approval where legal, privacy, or safety risk exists.

## Verification
Review dataset manifests, licenses, consent records, sampling statistics, environment coverage, and data-access controls.