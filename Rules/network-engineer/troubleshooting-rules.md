# Troubleshooting Rules

## Purpose
Resolve network faults through bounded hypotheses and preserved evidence.

## Scope
Connectivity, latency, loss, routing, DNS, security policy, wireless, and intermittent failures.

## MUST
- Define the observed symptom, scope, timeline, expected behavior, and last-known-good state before broad changes.
- Test hypotheses with packet, route, log, metric, configuration, or controlled-path evidence.
- Check dependencies layer by layer and compare working versus failing paths where possible.
- Preserve evidence before disruptive remediation when practical.

## MUST NOT
- Make multiple uncontrolled production changes that destroy causal evidence.
- Claim root cause solely because service recovered after a change.

## SHOULD
- Use the least invasive diagnostic that can discriminate between hypotheses.

## Exceptions
During severe outage, restoration may precede full diagnosis, but changes and evidence MUST be recorded for follow-up RCA.

## Verification
Review incident timeline, hypotheses, tests, packet/log evidence, configuration diffs, and causal validation.