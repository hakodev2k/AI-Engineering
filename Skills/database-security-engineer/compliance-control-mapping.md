# Compliance Control Mapping

## Purpose
Translate external or internal security obligations into concrete, testable database controls without confusing compliance with complete security.

## When to use
Use for audits, regulated systems, control design, evidence preparation, or gap remediation.

## Inputs
Applicable standards, policies, system scope, data classification, architecture, control catalog, and evidence requirements.

## Context to inspect
Confirm which databases and data flows are in scope, shared-responsibility boundaries, inherited controls, exceptions, and evidence owners.

## Core knowledge
A requirement may be satisfied by technical, procedural, or inherited controls. Mapping must identify implementation, ownership, evidence, frequency, and residual gaps. Passing an audit does not eliminate threats outside the standard.

## Procedure
1. Establish authoritative requirements and scope.
2. Decompose broad clauses into database-relevant obligations.
3. Map each obligation to existing controls.
4. Identify implementation and evidence owners.
5. Test whether evidence proves effective operation, not just policy existence.
6. Record gaps and compensating controls.
7. Track exception expiry and remediation.
8. Reassess mappings after architecture or standard changes.

## Decision points
Reuse shared controls when inheritance is valid and documented. Build database-specific controls only where shared controls do not cover the risk.

## Common failure patterns
Checkbox mapping, duplicate controls, screenshots without operational evidence, undefined scope, stale exceptions, and assuming encryption alone satisfies broad data-protection obligations.

## Verification
Sample requirements end to end from obligation through implementation to current evidence.

## Expected output
A traceable control matrix with owners, evidence, gaps, and review cadence.

## Stop conditions
Escalate legal interpretation, disputed scope, or formal risk acceptance to the authorized governance function.