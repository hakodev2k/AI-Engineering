# API Threat Modeling Rules

## Purpose
Ensure API designs are evaluated against realistic abuse paths before release.

## Scope
Public, partner, internal, administrative, and machine-to-machine APIs.

## MUST
- Identify assets, trust boundaries, actors, entry points, privileged operations, and abuse cases before approving material API changes.
- Evaluate authentication bypass, authorization failure, injection, replay, enumeration, resource exhaustion, and data-exposure threats.
- Record mitigations and residual risks for high-impact threats.
- Revisit the threat model when trust boundaries, identity flows, or sensitive data change.

## MUST NOT
- Treat an API as trusted solely because it is internal.
- Close a high-risk threat without evidence that its mitigation works.

## SHOULD
- Use a repeatable threat-modeling method and prioritize by exploitability and business impact.

## Exceptions
Emergency changes may use an abbreviated review only with documented risk, compensating controls, owner, and follow-up date.

## Verification
Inspect threat models, architecture diagrams, abuse-case tests, security findings, and mitigation evidence.