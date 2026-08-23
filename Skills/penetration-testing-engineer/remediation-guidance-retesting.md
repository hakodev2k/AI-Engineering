# Remediation Guidance and Retesting

## Purpose
Help engineering teams fix the root cause of validated vulnerabilities and independently verify that remediation closes the issue without introducing regressions.

## When to use
Use during remediation consultation and formal retest cycles.

## Inputs
Original finding/evidence, proposed fix, changed architecture/code/configuration, deployment version, and regression-test context.

## Context to inspect
Inspect root cause, shared components, alternative attack paths, compensating controls, rollout state, and whether the tested environment matches the remediated production design.

## Core knowledge
A patch can block one PoC while leaving the underlying weakness intact. Retesting should verify the security invariant, not merely that the original payload fails.

## Procedure
1. Restate the violated security property/root cause.
2. Review the proposed remediation against that root cause.
3. Identify sibling paths that use the same control.
4. Confirm the fix is deployed to the retest target.
5. Re-run the original safe reproduction.
6. Vary relevant inputs, identities, and paths to detect superficial filtering.
7. Check for regressions in legitimate behavior when appropriate.
8. Verify compensating controls if full remediation is deferred.
9. Record fixed, partially fixed, not fixed, or unable-to-verify status.
10. Update residual risk and evidence.

## Decision points
Accept compensating controls only when they materially reduce exploitability and ownership/expiry are clear. Require systemic remediation for shared authorization or trust failures.

## Common failure patterns
Retesting the old payload only, testing the wrong deployment, closing based on developer statement, ignoring alternate endpoints, and treating WAF signatures as root-cause fixes.

## Verification
The original and reasonable variant paths no longer violate the security invariant, with evidence tied to the remediated version/environment.

## Expected output
Retest status, evidence, residual risk, and concise remediation feedback.

## Stop conditions
Stop if the fix is not deployed, environment identity is uncertain, or retest requires new destructive actions outside authorization.