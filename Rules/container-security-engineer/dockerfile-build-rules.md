# Dockerfile and Build Rules

## Purpose
Prevent insecure or non-reproducible container builds from becoming trusted runtime artifacts.

## Scope
Applies to Dockerfiles or equivalent build definitions, build contexts, multi-stage builds, package installation, and build arguments.

## MUST
- Build definitions MUST be version-controlled and reviewable.
- Build contexts MUST exclude secrets, credentials, local caches, and unrelated repository content.
- Package and dependency installation MUST use deterministic or constrained versions appropriate to the ecosystem.
- Multi-stage builds MUST copy only required runtime artifacts into the final image.
- Build-time secrets MUST use secret-mount or equivalent ephemeral mechanisms and MUST NOT persist in image layers.

## MUST NOT
- MUST NOT pass credentials through ordinary build arguments or environment variables that become image metadata or layers.
- MUST NOT curl or download executable content from unverified sources and execute it without integrity validation.
- MUST NOT disable certificate validation to make build downloads succeed.
- MUST NOT leave private keys, package-manager credentials, or CI tokens in intermediate or final layers.

## SHOULD
- Keep build steps explicit and minimize privileged build features.
- Use cache controls that do not permit untrusted input to poison reusable build layers.

## Exceptions
Exceptions require source trust evidence, integrity controls, security review, and approval.

## Verification
Inspect build definitions, ignore files, image history, secret scanners, dependency locks, and CI build logs.