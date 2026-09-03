# Counterexample Analysis Rules

## Purpose
Turn counterexamples into reliable engineering evidence rather than dismissing or patching symptoms.

## Scope
Applies to model-checker traces, failed proof obligations, symbolic execution witnesses, property violations, and differential verification failures.

## MUST
- Reproduce each material counterexample with the same model, tool version, and configuration before acting on it.
- Classify the counterexample as a real defect, specification defect, abstraction artifact, environment-assumption violation, or tool issue using evidence.
- Minimize or simplify traces when necessary to expose the causal transition sequence.
- Correct the underlying model, implementation, requirement, or assumption rather than suppressing the failing property.
- Add regression verification for confirmed defects.

## MUST NOT
- Dismiss a counterexample because the scenario appears unlikely without evaluating reachability and consequence.
- Constrain the model solely to remove a failing trace unless the new constraint is a justified real-world assumption.
- Report a verification pass while known relevant counterexamples remain unresolved.

## SHOULD
- Preserve reduced traces as review artifacts and debugging fixtures.
- Compare counterexamples against production incidents or tests when similar behavior exists.

## Exceptions
A known accepted counterexample requires documented scope, impact, risk acceptance, and compensating control where applicable.

## Verification
Inspect reproducible traces, root-cause records, changed assumptions, regression properties, and evidence linking the resolution to the observed failure.