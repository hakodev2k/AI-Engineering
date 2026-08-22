# Security Policy

Security is a core concern for this repository because its content can influence agent behavior, external integrations, permissions, and production engineering workflows.

## Supported versions

This repository currently follows a rolling model. Only the latest content on the `main` branch is actively maintained. Historical commits, forks, copied packages, and locally modified versions are not supported.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability or include exploit details in a public pull request.

Use [GitHub's private vulnerability reporting](https://github.com/hakodev2k/AI-Engineering/security/advisories/new) when it is available. If that channel is unavailable, contact a repository maintainer through a private GitHub channel and share only enough public information to establish contact.

Include, where possible:

- the affected file, package, connector, or workflow;
- the vulnerability class and realistic impact;
- prerequisites and a minimal reproduction;
- whether credentials, personal data, external side effects, or privilege escalation are involved;
- suggested remediation or compensating controls;
- whether the issue is already public or under active exploitation.

Please avoid accessing data you do not own, causing external side effects, degrading a service, or testing against production systems without explicit authorization.

## What to expect

Maintainers will aim to acknowledge a report, assess its scope, coordinate a fix, and disclose it responsibly. Response time is best-effort and may vary with severity and maintainer availability. Please allow a reasonable remediation window before public disclosure.

## Security scope

Relevant reports include, but are not limited to:

- committed secrets or unsafe credential handling;
- MCP/API connector authorization or allowlist bypasses;
- missing approval boundaries for destructive or externally visible actions;
- prompt-injection paths that can trigger unintended tools or disclose sensitive context;
- schema, path, command, or input-validation flaws that enable unintended behavior;
- guidance that creates a reproducible, material security risk when followed as written.

General quality issues, feature requests, and non-sensitive documentation corrections should use the public issue tracker described in [SUPPORT.md](SUPPORT.md).

## Safe adoption

Repository content is provided as reusable reference material. Before production use, review permissions, pin dependencies, keep secrets outside prompts and source control, test in an isolated environment, and add organization-specific policy enforcement. The MIT License provides the software without warranty.
