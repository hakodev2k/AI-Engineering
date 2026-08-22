# MFA and Authentication Assurance

## Purpose
Design authentication assurance proportional to account risk while reducing phishing, bypass, recovery, and usability weaknesses.

## When to use
Use for MFA rollout, privileged access, sensitive transactions, conditional access, passwordless programs, or authentication incident remediation.

## Inputs
User populations, risk tiers, supported authenticators, device capabilities, threat model, recovery requirements, and regulatory obligations.

## Context to inspect
Inspect enrollment, authenticator binding, fallback methods, recovery, session duration, step-up triggers, privileged roles, service desks, and exception paths.

## Core knowledge
Not all MFA is equivalent. Phishing-resistant cryptographic authenticators provide stronger assurance than OTP or push approval. Recovery and enrollment can become weaker alternate authentication channels.

## Procedure
1. Segment users and actions by impact and threat exposure.
2. Define required assurance for each segment.
3. Prefer phishing-resistant methods for privileged and high-risk access.
4. Harden enrollment and authenticator replacement.
5. Design step-up rules for sensitive actions.
6. Restrict weak fallback methods and document exceptions.
7. Protect recovery with independent verification.
8. Detect MFA fatigue, unusual enrollment, and bypass events.
9. Test lost-device and emergency scenarios.
10. Measure adoption, failure, bypass, and support rates.

## Decision points
Use stronger methods where compromise impact justifies friction. Risk-based policies can reduce friction but must not silently downgrade high-impact access.

## Common failure patterns
SMS as the only strong factor, push fatigue, insecure help-desk resets, unenforced admin MFA, broad exclusions, permanent remembered sessions, and treating enrollment as low risk.

## Verification
Test normal, denied, fallback, recovery, replacement, step-up, and privileged flows. Confirm weak methods cannot satisfy stronger policy tiers.

## Expected output
An assurance model, authenticator policy, enrollment/recovery design, exceptions, monitoring, and verification evidence.

## Stop conditions
Escalate when required users cannot support the minimum assurance level or business exceptions materially weaken privileged access.