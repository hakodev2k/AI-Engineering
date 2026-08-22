# Accessibility and Inclusive Product Design

## Purpose
Ensure product decisions include users with disabilities, varied devices, languages, contexts, and capabilities rather than treating accessibility as late QA.

## When to use
Use during discovery, requirements, design review, launch readiness, and remediation of inaccessible workflows.

## Inputs
Target journeys, designs, content, supported platforms, accessibility standards, user research, and technical constraints.

## Context to inspect
Inspect keyboard operation, screen-reader semantics, focus, contrast, motion, zoom, error recovery, language, cognitive load, captions, and assistive technology constraints.

## Core knowledge
Accessibility is both a user outcome and engineering quality property. Product managers must make it part of scope and acceptance criteria, while specialists validate detailed conformance.

## Procedure
1. Identify critical journeys and affected accessibility needs.
2. Include disabled users or representative research where practical.
3. Define applicable accessibility requirements with design and engineering.
4. Review interaction patterns before implementation.
5. Add accessibility behavior to acceptance criteria.
6. Test critical journeys with automated and manual methods.
7. Triage defects by user impact, not only rule count.
8. Prevent regressions through design systems and automated checks.
9. Track unresolved barriers and remediation commitments.

## Decision points
Prioritize blockers in core journeys over cosmetic issues. Prefer accessible standard controls unless custom interaction delivers necessary value and can be validated.

## Common failure patterns
Accessibility after launch, automated scans as the only test, inaccessible custom controls, missing keyboard flows, and excluding accessibility from MVP.

## Verification
Critical journeys work with relevant assistive methods; acceptance criteria pass; known exceptions have owners and justified remediation plans.

## Expected output
Accessible product requirements, validated journeys, defect priorities, and regression protections.

## Stop conditions
Stop launch of critical flows when severe accessibility barriers violate required standards or prevent essential use.