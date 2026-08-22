# Validate Before Egress Workflow

## Trigger
Any agent/tool call whose destination URL is supplied by a user, repository content, retrieved data, model output, API response, or runtime configuration.

## Entry conditions
Exact effective URL and purpose are available; repository policy can be read.

## Stages
1. **Context** — caller records URL, purpose, credential class, and expected external service.
2. **Static validation** — Egress Verifier rejects malformed URL, userinfo, disallowed scheme, blocked suffix, or non-allowlisted host.
3. **DNS validation** — run `python scripts/validate-url.py URL`; require all answers to be public and exit code 0.
4. **Approval checkpoint** — a new public host stops for human approval and an explicit policy change. Private/reserved destinations are not approvable exceptions.
5. **Execute** — caller may make one network request only to the validated host. Default redirect handling is disabled.
6. **Post-request check** — if the client reports a redirect or effective host different from the validated host, stop and re-enter validation for the new URL.
7. **Verify** — preserve sanitized decision evidence and confirm no credential crossed to an unapproved host.

## Tools
`config/policy.yaml`, `scripts/validate-url.py`, DNS resolver, and the caller's HTTP/network tool after approval.

## Produced artifacts
A sanitized decision record containing status, host, resolved IPs, reason, and timestamp.

## Checkpoints
No network execution before validator success. No policy expansion without human approval.

## Retry rules
DNS resolution may be retried once after a transient resolver error. Network execution retries are owned by the calling workflow and must re-run validation before each retry if DNS answers may have changed. Policy denials are not retryable.

## Failure paths
Malformed URL, blocked network, mixed public/private DNS answers, missing policy, or validator failure => stop. New host => approval_required. Permission failure => stop without widening permissions.

## Approval points
Adding an allowlisted hostname or enabling redirects requires explicit human approval. Sending a new credential class to an existing host also requires approval.

## Definition of Done
The destination was validated immediately before use, execution used the validated authority, redirects did not bypass validation, evidence was preserved, and no approval boundary was crossed.
