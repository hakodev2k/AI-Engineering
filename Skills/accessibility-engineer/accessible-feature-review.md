# Accessible Feature Review

## Purpose
Assess a changed user journey for accessibility regressions, identify an appropriate remediation path, and produce evidence a delivery team can verify.

## When to use
Use before accepting a new or materially changed user-facing flow, component, form, modal, navigation pattern, authentication step, content structure, media experience, or design-system primitive.

## Inputs
The affected journey and platforms, target accessibility standard, designs and implementation, supported browsers/devices, assistive-technology assumptions, known limitations, acceptance criteria, and access to a safe test environment.

## Procedure
1. Define the user task, start and finish state, expected errors and recovery paths, and the accessibility target.
2. Identify semantic structure, interactive controls, dynamic updates, media, visual-only cues, time limits, and custom behavior in the journey.
3. Review native semantic structure, accessible names, labels, instructions, state, error association, and status announcements.
4. Execute the full journey by keyboard or the platform-equivalent alternate input; record focus order, visible focus, modal behavior, shortcuts, and escape paths.
5. Check reflow, zoom, text scaling, contrast, color-independent cues, reduced motion, and touch or target-size considerations relevant to the platform.
6. Test representative assistive technology where available, focusing on navigation, form completion, errors, dynamic updates, and completion confirmation.
7. Run the target repository's automated accessibility checks and triage each result instead of accepting or suppressing it blindly.
8. Classify findings by blocked task, affected users, reproducibility, source component, and safe remediation priority.
9. Re-test the remediated journey and adjacent shared components; document any approved exception and alternative path.

## Decision points
Escalate when the target accessibility standard is undefined, a shared component requires a breaking change, testing requires production accounts or personal data, or an issue blocks a core task without a safe alternative. Prefer native controls and established component-library patterns over custom ARIA behavior.

## Verification
Confirm the journey completes by keyboard, focus and dynamic states are understandable, required information is not color-only, affected controls have appropriate semantics, automated findings are resolved or justified, and manual results are recorded for the supported platform and assistive technology.

## Expected output
A concise accessibility review containing the journey, environments tested, findings with user impact and reproduction steps, remediation recommendation, evidence, residual limitations, exception approvals, and re-test result.

## Stop conditions
Stop and request clarification when the intended user task, platform support, accessibility target, or safe test access is unavailable. Do not claim conformance from static inspection, a single tool, or an unverified workaround.
