# Verification Report

## Status model
This package distinguishes **Implemented**, **Measured**, and **Verified**. It does not claim that a reference package alone proves the security of a future host application.

## Implemented
- Central URL policy with separate fetch/browser operation kinds.
- HTTPS-by-default scheme enforcement.
- Embedded credential rejection.
- DNS/IP classification using standard-library IP semantics.
- Fail-closed handling for private, loopback, link-local, IPv6 private, mixed-address and DNS-failure cases.
- Explicit deny-host support.
- Safe fetch wrapper with automatic redirects disabled, per-hop validation, timeout, redirect and response-size budgets.
- Browser endpoint validation hook.
- Enforceable MUST/MUST NOT/SHOULD rules.
- Bounded workflows, failure paths and independent verifier role.
- Adversarial unit-test fixture suite.

## Measured
A deterministic equivalent of the core URL-policy fixtures was executed during package generation. Result: **12/12 fixture decisions matched expected security behavior** for public HTTPS, RFC1918, loopback, link-local/cloud-metadata, mixed DNS answers, IPv6 private, private IP literal, production HTTP, embedded credentials, unsafe browser scheme, public browser HTTPS and DNS failure.

This measurement validates the core classification invariants. It does not exercise a host application's HTTP stack or OS browser launcher.

## Verified
Static package verification confirms:
- policy failures produce deny decisions before intended network use;
- safe fetch disables normal redirect handling and validates each redirect target before the next request;
- redirect count and response size are bounded;
- browser URLs use a separate policy path;
- no secret values are required by scripts or committed config;
- tests avoid deliberately contacting cloud metadata/internal services.

## Integration verification still required per adopter
A consuming MCP client must additionally prove:
1. every metadata-derived URL sink routes through the guard;
2. its HTTP library cannot bypass per-hop redirect validation;
3. its OS browser launcher is invoked only after browser-policy approval;
4. adversarial mock redirect fixtures cause zero requests to the denied destination;
5. positive OAuth interoperability fixtures still succeed;
6. peer-IP verification or equivalent egress enforcement addresses DNS rebinding where required.

## Residual risk
The reference Python validator resolves and classifies addresses before the request, but Python `urllib` does not expose a simple portable peer-IP pinning hook in this implementation. Therefore the package explicitly recommends a transport with peer verification/connection pinning or an egress proxy/firewall for stronger DNS-rebinding resistance.

## Security acceptance criteria
- 100% private/loopback/link-local fixtures blocked.
- 100% mixed global/non-global DNS fixtures blocked.
- 100% unsafe browser-scheme fixtures blocked.
- 100% redirect-to-denied-destination integration fixtures blocked before destination request.
- Approved public HTTPS metadata continues to work.
- No unrestricted production private-network exception.
- No policy denial is automatically retried.

## Definition of Done
For the reusable package itself: evidence recorded, scripts/config/docs/tests present, core fixture decisions measured, static references consistent, no secrets embedded.

For a host integration: all URL sinks guarded, redirect/browser paths verified, positive and negative integration tests pass, residual DNS-rebinding risk mitigated or formally accepted, and independent security review complete.
