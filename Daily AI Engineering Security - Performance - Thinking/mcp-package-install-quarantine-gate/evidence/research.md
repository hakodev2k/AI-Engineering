# Research

## Topic
MCP Package Install Quarantine Gate

## Category
Security

## Problem
Package installation is itself an attack surface for MCP/agent integrations. Malicious packages can execute before runtime tool permission systems are active and can access developer/CI credentials.

## Why it matters now
Multiple malicious MCP-themed npm packages were disclosed in August 2026, while a broader 2026 npm supply-chain campaign also compromised legitimate MCP packages and used install-time execution to steal credentials.

## Affected users
Developers installing MCP servers or agent skills, IDE/CLI agent users, CI systems, platform teams maintaining shared MCP catalogs.

## Current public evidence
### Observed evidence
1. Snyk classified `mcp-server-git` as a malicious npm package, disclosed 2026-08-20 and published 2026-08-22, recommending avoidance of all instances. Snyk reports attack activity and organization-impersonation characteristics.
2. Snyk classified `mcp-real-chrome` as malicious, disclosed 2026-08-24 and published 2026-08-26, likewise removed from the package manager.
3. GitHub Advisory GHSA-p6wc-j7x7-ff3v documents malicious versions of `@antv/mcp-server-antv` in the Mini Shai-Hulud campaign: compromised npm publishing, a malicious `preinstall` hook, credential theft across cloud/GitHub/npm/Kubernetes/SSH/Docker/database/Slack surfaces, and automated exfiltration.
4. Snyk documented a June 2026 node-gyp supply-chain compromise where malicious execution was hidden in `binding.gyp`, demonstrating that simply checking `preinstall`/`postinstall` scripts is insufficient.

### Interpretation
MCP packages are attractive because users expect them to access files, browsers, APIs and credentials. Runtime MCP permission gates cannot protect secrets already stolen during package installation. A reusable pre-execution quarantine boundary is therefore distinct from runtime tool authorization.

### Proposed solution
Resolve and inspect exact package artifacts before code execution; combine advisory/denylist evidence with deterministic checks for lifecycle scripts, native-build execution, suspicious executable/binary content, publisher trust, and immutable hashes; require explicit approval when uncertainty remains.

## Existing approaches
SCA/Dependabot/Snyk/OSV scanning; registry takedown; lockfiles; package integrity hashes; sandboxing; package-manager `--ignore-scripts`; manual review.

## Remaining limitations
New malware can precede signatures; hashes authenticate content, not intent; lifecycle scripts are only one execution path; maintainers can be compromised; agents may install packages directly from natural-language instructions.

## Root-cause analysis
- Installation is often treated as setup rather than privileged execution.
- Agent environments contain high-value credentials.
- Publisher identity and version provenance are not always checked.
- Package metadata can trigger execution before runtime security mediation.
- Advisory checks and source/tarball inspection are not coupled into one blocking workflow.

## Improvement opportunity
Make package introduction a fail-closed, evidence-producing gate that runs before installation and can be reused by IDE agents, CI pipelines and MCP catalogs.

## Relevant sources
- https://security.snyk.io/vuln/SNYK-JS-MCPSERVERGIT-19161542
- https://security.snyk.io/vuln/SNYK-JS-MCPREALCHROME-19268023
- https://github.com/advisories/GHSA-p6wc-j7x7-ff3v
- https://snyk.io/blog/node-gyp-supply-chain-compromise-self-propagating-npm-worm-binding-gyp/
