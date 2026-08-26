# AI Control Framework Design

## Purpose
Design proportionate preventive, detective, corrective, and governance controls for AI risks across the lifecycle.

## When to use
Use when creating control standards, remediating audit findings, or translating risk policy into operational requirements.

## Inputs
Risk taxonomy, risk tiers, obligations, architecture, lifecycle, incidents, audit findings, existing enterprise controls.

## Core knowledge
Controls require objective, owner, trigger, procedure, evidence, frequency, and effectiveness criteria. Reuse enterprise controls where they genuinely cover AI risk.

## Procedure
1. Map material risks and obligations.
2. Identify existing controls and coverage gaps.
3. Define control objectives before implementation details.
4. Select preventive, detective, and corrective mechanisms.
5. Scale control rigor by risk tier.
6. Define ownership, frequency, evidence, and exceptions.
7. Integrate controls into engineering and business workflows.
8. Define design and operating-effectiveness tests.
9. Pilot and remove duplicative or non-value controls.
10. Version the control library.

## Decision points
Automate deterministic, frequent checks; retain human judgment where context is material. Prefer fewer strong controls over many weak attestations.

## Common failure patterns
Checkbox controls, unverifiable wording, duplicate controls, no owner, controls performed after irreversible decisions.

## Verification
Test design against risk scenarios and sample operating evidence from real systems.

## Expected output
Control library with objectives, procedures, evidence, owners, frequencies, and test methods.

## Stop conditions
Escalate when control cost or feasibility conflicts materially with approved risk appetite.