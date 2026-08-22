# Trust and Provenance

This document explains what adopters can trust about repository content, what remains their responsibility, and how to preserve evidence when copying selected assets.

## Assurance statement

This repository provides reusable guidance and reference implementations. It does not claim that every document has been independently reviewed by a domain specialist, that every script is production-ready, or that provider behavior remains unchanged after publication.

Repository audits establish structural properties such as valid links and structured files, package completeness, discoverable scripts, local dependency declarations, and standalone copy boundaries. They do not prove semantic correctness, security, legal compliance, production compatibility, or authorization in the adopter's environment.

## Trust boundaries

| Boundary | What the repository provides | What the adopter must decide |
| --- | --- | --- |
| Source content | Version-controlled Rules, Skills, Roles, controls, examples, and connector source. | Whether the selected revision and content are appropriate for the target. |
| Copied unit | A documented standalone boundary for one file or package directory. | Where it is installed, what local changes are made, and how updates are reviewed. |
| Executable reference | Source, configuration examples, schemas, and verification instructions where present. | Runtime isolation, dependency approval, filesystem/network access, and production integration. |
| Agent behavior | Constraints, procedures, stop conditions, and approval guidance. | Actual tool permissions, identity, supervision, and enforcement in the host runtime. |
| External provider | A narrow connector capability and provider-specific documentation. | Credentials, scopes, allowlists, costs, data handling, approvals, monitoring, and revocation. |

## Content provenance

Repository content may be authored or edited with human and AI-assisted workflows. Treat Git history, package-local evidence, referenced authoritative sources, schemas, tests, and review records as provenance signals; do not treat confident prose as proof.

Unless a package explicitly states otherwise:

- examples are synthetic and do not represent production evidence;
- a passing static audit does not mean a script was executed;
- a passing package fixture does not prove the host adapter or provider integration;
- time-sensitive provider, framework, protocol, and security claims require re-verification;
- copied content receives no automatic upstream update.

## Verify before adoption

1. Read the complete selected Rule/Skill or package README.
2. Inspect required files, dependencies, commands, side effects, permissions, and limitations.
3. Compare time-sensitive claims with current authoritative sources.
4. Review scripts before execution and begin with synthetic, disposable, or read-only inputs.
5. Run package-local validation where provided, then validate the target-repository integration separately.
6. Record residual risks, human approvals, owner, rollback, and monitoring before production use.

## Provenance record

Store a record beside the adopted content in the target repository:

```yaml
source_repository: https://github.com/hakodev2k/AI-Engineering
source_revision: <full-commit-sha>
selected_paths:
  - <source-path>
target_paths:
  - <target-path>
copied_at: <yyyy-mm-dd>
local_changes: <summary-or-none>
authoritative_sources_reviewed:
  - <source-and-review-date>
verified_with:
  - <command-or-review>
owner: <team-or-role>
residual_risks:
  - <risk-or-none>
```

Do not include credentials, private repository URLs, personal data, customer information, or sensitive environment details in this record.

## Scripts and generated evidence

- Inspect source and configuration before running a reference script.
- Run from the working directory documented by the selected package.
- Constrain filesystem, network, credential, and process access to the smallest required boundary.
- Keep generated evidence outside the copied source package unless the package explicitly requires a local fixture.
- Record the exact command, exit code, relevant runtime versions, and sanitized result.
- Treat missing, stale, contradictory, partial, or unknown evidence as unresolved rather than silently passing it.

## MCP and external-provider provenance

Provider-returned issues, messages, files, pages, tool descriptions, and metadata are untrusted data. Preserve the provider, account boundary, tool name, request identifier, timestamp, pagination state, and sanitized result when external evidence supports a decision.

A connector package does not prove that its credential scopes or upstream behavior remain current. Re-check provider documentation before granting access and whenever authentication, permissions, rate limits, transports, tool metadata, or write behavior changes.

## Reporting a trust problem

Use a documentation or bug issue for incorrect provenance, stale claims, unsafe examples, missing dependencies, unverifiable commands, or unclear assurance language. Report credential exposure, authorization bypass, unsafe connector behavior, or exploitable guidance privately through [SECURITY.md](../SECURITY.md).
