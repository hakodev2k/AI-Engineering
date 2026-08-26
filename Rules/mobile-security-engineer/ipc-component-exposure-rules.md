# IPC and Component Exposure Rules

## Purpose
Prevent unauthorized invocation or data access through exported mobile components and inter-process communication.

## Scope
Activities, services, receivers, providers, intents, extensions, URL handlers, IPC interfaces, and shared containers.

## MUST
- Minimize externally reachable components and explicitly declare intended exposure.
- Authenticate and authorize callers for sensitive IPC operations using enforceable platform mechanisms and application checks.
- Validate all IPC payloads, identifiers, URIs, and file references before use.
- Protect shared resources according to least privilege.

## MUST NOT
- Export sensitive components merely for implementation convenience.
- Assume another application is trustworthy because it knows an action name, URI, or package convention.
- Return sensitive data to an unverified caller.

## SHOULD
- Prefer explicit addressing and narrow interfaces over broad implicit dispatch for sensitive operations.
- Separate public integration surfaces from internal components.

## Exceptions
Required external exposure must document intended callers, abuse cases, authorization controls, and verification evidence.

## Verification
Enumerate exported components and permissions; invoke them from an untrusted test application; fuzz payloads and caller identities.