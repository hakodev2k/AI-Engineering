# Network Control Rules

## Purpose
Make browser-network behavior observable, bounded, and representative of the workflow under test or automation.

## Scope
Applies to HTTP requests, WebSockets, interception, stubbing, routing, proxies, DNS assumptions, and network-condition simulation.

## MUST
- Network interception MUST declare whether it observes, modifies, blocks, or fulfills traffic.
- Mocked responses MUST preserve the contract characteristics required by the scenario, including status, headers, payload shape, and timing-sensitive behavior where relevant.
- External requests that can mutate real systems MUST be explicitly identified and controlled.
- Assertions dependent on a request MUST correlate to the intended request rather than any request with a similar URL.
- Network failures MUST retain enough request metadata for diagnosis without leaking secrets.

## MUST NOT
- Broad request stubbing MUST NOT hide integration failures that the scenario is intended to detect.
- Authentication headers, cookies, tokens, or sensitive request bodies MUST NOT be logged unredacted.
- Browser automation MUST NOT send destructive or financially consequential requests to production without explicit human approval.

## SHOULD
- Contract tests SHOULD complement browser mocks for important integrations.
- Network-condition tests SHOULD use reproducible latency, loss, or offline scenarios rather than ad hoc throttling.

## Exceptions
A broad mock may be used for a narrowly scoped UI test when integration behavior is covered elsewhere and the boundary is explicit.

## Verification
Inspect routes and interceptors, compare mocked contracts with current interfaces, run selected workflows against real test integrations, and review captured traffic with secrets redacted.