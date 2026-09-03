# Safety and Responsible Research

## Purpose
Integrate safety, misuse, privacy, bias, data governance, and release-risk analysis into AI research before scaling or externalizing a capability. This skill helps a Senior AI Research Engineer identify when improved capability also increases potential harm and ensures research evidence includes relevant guardrails.

## When to use
Use when training or evaluating more capable models, working with sensitive data, testing dual-use capabilities, releasing checkpoints or datasets, changing tool access, or designing experiments whose outcomes could materially alter system risk.

## Inputs
- Research hypothesis and intervention
- Data provenance and governance constraints
- Model capability scope
- Planned tools, external access, or deployment context
- Safety policies and evaluation suites
- Release or handoff plan

## Preconditions
Define the intended research value and foreseeable misuse or harm scenarios. Confirm authorization for data, compute, external systems, and any elevated-risk evaluation environment.

## Context to inspect
Inspect data licenses and consent, sensitive attributes, memorization exposure, dangerous capability classes, prompt/tool permissions, model access boundary, sandboxing, output retention, red-team findings, prior incidents, and downstream release assumptions.

## Core knowledge
Safety is not a single refusal benchmark. Research can increase risk through capability uplift, privacy leakage, harmful bias, autonomous tool use, manipulation, cyber/biological assistance, or unrecoverable release of weights/data. Risk controls should be proportional to capability and exposure. Senior researchers distinguish exploratory containment from deployment safety and avoid publishing operational details that unnecessarily increase misuse potential.

## Procedure
1. Identify affected capability categories and likely beneficiaries.
2. Enumerate plausible misuse, accidental harm, privacy, and fairness risks.
3. Classify which risks are changed by the proposed intervention rather than inherited from the baseline.
4. Review data provenance, retention, consent, and sensitive-content handling.
5. Decide whether the experiment requires isolated infrastructure, restricted tools, network controls, or access logging.
6. Add safety and robustness evaluations proportionate to the capability.
7. Include protected or high-impact slices where fairness concerns are relevant and legally appropriate.
8. Test whether capability gains coincide with regressions in safety guardrails.
9. Record high-severity examples separately from aggregate rates.
10. Define stop thresholds before high-risk scaling experiments.
11. Restrict artifact distribution according to risk and authorization.
12. Document residual risk and proposed mitigations for any handoff or release.
13. Seek specialist review when the research crosses established safety, security, privacy, legal, or bio/cyber boundaries.
14. Reassess risk after major scale, data, tool-access, or autonomy changes.

## Decision points
- Use stronger containment when a capability could enable material harm even if the experiment is internal.
- Prefer aggregated or redacted reporting when detail would create unnecessary misuse value.
- Do not treat safety regressions as acceptable merely because average capability improves.
- Escalate specialist review rather than relying on research judgment alone for regulated or high-impact domains.

## Common failure patterns
- Adding safety evaluation only after the model is trained.
- Treating benchmark refusal rate as the complete risk picture.
- Using sensitive data without validated purpose and governance.
- Publishing powerful artifacts before evaluating misuse consequences.
- Ignoring rare severe failures behind favorable averages.
- Assuming an internal prototype cannot create security or privacy exposure.
- Carrying production permissions into research environments unnecessarily.

## Verification
Responsible-research controls are implemented when risk scenarios, access restrictions, safety evaluations, and governance checks are documented. They are verified when controls are exercised, high-severity cases are reviewed, artifact access matches policy, material regressions trigger predefined action, and residual risk has an accountable owner.

## Expected output
A research risk assessment, safety evaluation results, containment/access controls, data-governance notes, stop thresholds, residual risks, and approval/escalation record where required.

## Stop conditions
Stop and escalate when the experiment enters an unapproved high-risk capability area, data authorization is unclear, necessary containment is unavailable, material safety regressions exceed thresholds, or releasing artifacts could create disproportionate harm.