# Error Diagnostics Rules

## Purpose
Make browser automation failures actionable by preserving high-signal diagnostic evidence.

## Scope
Applies to exceptions, screenshots, traces, console output, page state, network evidence, and failure reporting.

## MUST
- Failures MUST preserve the original exception or assertion information and relevant causal context.
- Critical failures MUST capture sufficient evidence to reconstruct browser state, such as URL, page identity, trace, screenshot, console messages, or network events as appropriate.
- Diagnostic collection MUST redact secrets and sensitive data before publication or long-term storage.
- Framework errors MUST be distinguished from application failures when evidence supports the distinction.
- Diagnostic artifacts MUST be correlated to the exact scenario and execution attempt.

## MUST NOT
- Unexpected exceptions MUST NOT be swallowed or replaced by generic success/failure messages that destroy causal information.
- Screenshot-only diagnosis MUST NOT be considered sufficient when timing, network, console, or DOM evidence is required.
- Diagnostics MUST NOT expose credentials, tokens, private keys, or sensitive payloads.

## SHOULD
- Structured traces SHOULD be preferred for complex asynchronous failures.
- Failure messages SHOULD identify the failed intent and relevant observed state.

## Exceptions
Reduced diagnostics may be required for highly sensitive workflows; document compensating evidence and access controls.

## Verification
Trigger representative failures, inspect resulting artifacts, validate redaction, confirm correlation identifiers, and verify engineers can determine the failing stage without rerunning blindly.