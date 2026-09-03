# Rules: Safety and Evidence

## MUST

- Map every affected process boundary before claiming completion.
- Distinguish facts, hypotheses, decisions, and open questions.
- Use standard trace propagation APIs or established repository abstractions when available.
- Validate or delegate validation of inbound W3C Trace Context to the tracing library.
- Preserve evidence for scanner findings, tests, builds, and verification.
- Keep implementation retries bounded to two.
- Require an independent Verification Agent after implementation.
- Stop before any approval-required action.

## MUST NOT

- Fabricate trace/span IDs to make logs appear correlated.
- Treat the presence of a `traceparent` string as proof of correct propagation.
- Silently accept malformed/untrusted propagation metadata.
- Reuse mutable active context across independent job executions.
- Disable validation, authentication, or security controls to make tracing work.
- Change production sampling/export configuration without explicit approval.
- Break public API or message contracts without explicit approval.
- Force push, rewrite history, deploy to production, or alter secrets/infrastructure autonomously.
- Retry until successful.

## SHOULD

- Prefer framework auto-instrumentation over duplicate manual instrumentation.
- Add focused tests at the exact broken boundary.
- Keep correlation IDs distinct from trace IDs unless the application has an explicit documented mapping.
- Minimize edits to tracing configuration unrelated to the confirmed defect.
- Record false-positive scanner findings so later agents do not rediscover them without context.