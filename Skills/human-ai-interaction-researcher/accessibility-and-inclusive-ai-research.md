# Accessibility and Inclusive AI Research

## Purpose
Evaluate whether AI interactions work across diverse abilities, languages, literacy levels, devices, input modes, and assistive technologies without creating disproportionate burden or exclusion.

## When to use
Use during design, evaluation, launch review, and investigation of accessibility or inclusion complaints for AI-enabled experiences.

## Inputs
Target population, accessibility requirements, interaction modalities, supported languages, assistive technologies, model capabilities, and task risks.

## Context to inspect
Inspect keyboard and screen-reader behavior, speech and vision inputs, generated content structure, timing, cognitive load, language handling, error recovery, and alternative interaction paths.

## Core knowledge
Accessibility includes interface mechanics and AI behavior. Generative outputs can introduce inaccessible structure, excessive verbosity, ambiguous labels, unstable focus, or modality-specific failures. Inclusive research should involve affected users rather than relying solely on checklists.

## Procedure
1. Identify user groups and access needs relevant to the product.
2. Map critical tasks and interaction modalities.
3. Conduct standards-based inspection for deterministic interface issues.
4. Recruit participants with relevant lived experience for interaction research.
5. Test input, output, navigation, verification, and recovery workflows.
6. Evaluate generated content for structure, clarity, and modality compatibility.
7. Test timeouts, streaming, dynamic updates, and focus behavior.
8. Examine whether AI failures disproportionately burden particular groups.
9. Test language and literacy demands where relevant.
10. Prioritize issues by task impact, exclusion risk, and availability of alternatives.

## Decision points
Use expert audit for standards coverage; participant research for lived interaction quality; automated checks for repeatable regressions. None substitutes completely for the others.

## Common failure patterns
Testing only deterministic UI, assuming generated text is inherently accessible, recruiting without accommodation, treating one disability as representative, and offering inaccessible fallback channels.

## Verification
Re-test critical workflows with assistive technology and representative users after changes. Confirm both technical conformance and task completion.

## Expected output
An accessibility and inclusion assessment with affected workflows, evidence, severity, systemic patterns, and remediation priorities.

## Stop conditions
Stop when required accommodations cannot be provided, testing would impose unreasonable burden, or critical accessibility defects prevent meaningful participation.