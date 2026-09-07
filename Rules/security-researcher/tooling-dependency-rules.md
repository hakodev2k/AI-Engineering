# Research Tooling and Dependency Rules

## Purpose
Ensure security research tools, dependencies, plugins, and scripts do not introduce untracked risk or undermine the validity of research results.

## Scope
Applies to scanners, debuggers, fuzzers, decompilers, proxies, exploit frameworks, package dependencies, plugins, containers, scripts, and third-party research utilities.

## MUST
- Security-critical conclusions MUST record the relevant tool and version when tool behavior can affect the result.
- New tools or plugins with access to sensitive artifacts, credentials, traffic, or source code MUST be sourced from trusted locations and reviewed proportionally to risk.
- Dependencies used in repeatable research workflows MUST be pinned, locked, or otherwise version-controlled where practical.
- Tool output MUST be independently validated before it is treated as proof of a vulnerability.
- Tools that transmit samples, telemetry, queries, or metadata externally MUST have that behavior understood before sensitive use.
- Privileged tools MUST run with only the permissions needed for the experiment.
- Modified research tools MUST preserve change history sufficient to reproduce their behavior.
- Tool-generated files and caches MUST be included in sensitive-data cleanup where applicable.

## MUST NOT
- MUST NOT execute unknown research scripts with administrator or production credentials merely for convenience.
- MUST NOT assume a scanner finding is correct because the tool is widely used.
- MUST NOT silently upgrade critical tooling during a long-running campaign when the change may invalidate comparisons.
- MUST NOT disable endpoint, sandbox, or network safeguards globally to accommodate a tool without explicit approval.
- MUST NOT send proprietary samples to cloud-backed tools unless such transfer is authorized.

## SHOULD
- Prefer reproducible environments such as pinned containers or documented toolchains.
- Validate important findings with a second technique when tooling could produce false positives.
- Track known defects or limitations in critical research tools.

## Exceptions
Unpinned or experimental tooling may be used for exploratory work if results are treated as provisional until reproduced in a controlled environment.

## Verification
Inspect tool manifests, package locks, hashes where appropriate, permissions, network behavior, version records, and independent reproductions. Confirm material findings do not rely solely on opaque tool output.