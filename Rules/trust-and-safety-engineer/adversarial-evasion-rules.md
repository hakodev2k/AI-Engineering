# Adversarial Evasion Rules

## Purpose
Require safety controls to anticipate and withstand deliberate attempts to bypass detection, enforcement, and rate controls.

## Scope
Applies to obfuscation, account cycling, device or network rotation, content mutation, automation, detector probing, and adversarial adaptation.

## MUST
- High-value safety controls MUST document plausible evasion techniques and the signals available to detect adaptation.
- Detection strategies MUST avoid depending on a single easily mutable identifier when stronger corroborating signals are available.
- Repeated near-threshold behavior, rapid account replacement, and coordinated mutation patterns MUST be considered in abuse investigations where relevant.
- Evasion-sensitive telemetry MUST be access-controlled to reduce leakage of operational thresholds and detection logic.
- Material evidence that attackers adapted to a control MUST trigger reassessment of detector assumptions and mitigation coverage.
- Controls that expose user-facing explanations MUST balance transparency with the risk of materially enabling circumvention.

## MUST NOT
- MUST NOT publish internal thresholds, exact signatures, or sensitive detection features when disclosure would materially increase evasion capability.
- MUST NOT assume a blocked identifier represents a blocked actor.
- MUST NOT respond to evasion by indiscriminately broadening enforcement without measuring collateral impact.
- MUST NOT retain invasive identifiers solely for convenience when less privacy-invasive signals can achieve the safety objective.

## SHOULD
- Detection SHOULD combine behavioral, temporal, graph, and content signals when appropriate.
- Teams SHOULD maintain adversarial test sets containing known bypass patterns.
- Controls SHOULD degrade attacker economics by increasing cost, friction, or uncertainty without unnecessarily burdening legitimate users.

## Exceptions
Incident responders MAY temporarily use sensitive signatures or narrow emergency controls with restricted disclosure, explicit expiry, and review.

## Verification
Inspect threat models, adversarial test cases, detector feature dependencies, incident learnings, access permissions, and bypass-rate trends. Confirm known evasion patterns are represented in evaluation and that mitigations do not create uncontrolled false positives.