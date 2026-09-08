from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from mcp.server.fastmcp import FastMCP

from .config import Config, load_config
from .models import AstInput, ContentScanInput, CustomRuleScanInput, FindingsInput, LocalScanInput
from .upstream import OfficialSemgrepMcp


def _check_content_limits(config: Config, files: list[Any]) -> None:
    if not files or len(files) > config.max_files:
        raise ValueError(f"files must contain 1..{config.max_files} entries")
    total = sum(len(item.content.encode("utf-8")) for item in files)
    if total > config.max_code_bytes:
        raise ValueError(f"code payload exceeds {config.max_code_bytes} bytes")


def _check_local_paths(paths: list[str], max_files: int) -> None:
    if not paths or len(paths) > max_files:
        raise ValueError(f"paths must contain 1..{max_files} entries")
    for raw in paths:
        path = Path(raw)
        if not path.is_absolute() or not path.is_file():
            raise ValueError("every local scan path must be an existing absolute file")


def create_server(config: Config | None = None, upstream: OfficialSemgrepMcp | None = None) -> FastMCP:
    cfg = config or load_config()
    client = upstream or OfficialSemgrepMcp(cfg)

    @asynccontextmanager
    async def lifespan(_: FastMCP):
        try:
            yield
        finally:
            await client.close()

    mcp = FastMCP("semgrep-connector", lifespan=lifespan)

    @mcp.tool(name="semgrep.language.list", description="List languages supported by the official Semgrep engine. Risk=READ; approval=false.")
    async def language_list() -> Any:
        return await client.call("get_supported_languages", {})

    @mcp.tool(name="semgrep.rule.schema.get", description="Get the official Semgrep rule schema. Risk=READ; approval=false.")
    async def rule_schema_get() -> Any:
        return await client.call("semgrep_rule_schema", {})

    @mcp.tool(name="semgrep.scan.content", description="Scan supplied in-memory code files using the official Semgrep MCP server. Risk=READ; approval=false.")
    async def scan_content(input: ContentScanInput) -> Any:
        _check_content_limits(cfg, input.files)
        return await client.call("semgrep_scan_remote", {"code_files": [f.model_dump() for f in input.files]})

    @mcp.tool(name="semgrep.scan.local_files", description="Scan existing absolute local files using the official Semgrep MCP server. Risk=READ; approval=false.")
    async def scan_local_files(input: LocalScanInput) -> Any:
        _check_local_paths(input.paths, cfg.max_files)
        return await client.call("semgrep_scan", {"code_files": [{"path": p} for p in input.paths]})

    @mcp.tool(name="semgrep.scan.custom_rule", description="Scan supplied code with one explicit Semgrep YAML rule. Risk=READ; approval=false.")
    async def scan_custom_rule(input: CustomRuleScanInput) -> Any:
        _check_content_limits(cfg, input.files)
        return await client.call("semgrep_scan_with_custom_rule", {"code_files": [f.model_dump() for f in input.files], "rule": input.rule_yaml})

    @mcp.tool(name="semgrep.ast.get", description="Parse code and return Semgrep's abstract syntax tree. Risk=READ; approval=false.")
    async def ast_get(input: AstInput) -> Any:
        if len(input.code.encode("utf-8")) > cfg.max_code_bytes:
            raise ValueError("code payload exceeds configured byte limit")
        return await client.call("get_abstract_syntax_tree", input.model_dump())

    async def _findings(input: FindingsInput, issue_type: str) -> Any:
        if not cfg.app_token:
            raise PermissionError("SEMGREP_APP_TOKEN is required for AppSec Platform findings")
        for repo in input.repositories:
            if not repo or len(repo) > 300 or repo.count("/") != 1:
                raise ValueError("repositories must use owner/repository form")
        return await client.call("semgrep_findings", {"issue_type": issue_type, "repos": input.repositories, "status": input.status, "severities": input.severities, "refs": input.refs, "limit": input.limit})

    @mcp.tool(name="semgrep.finding.code.list", description="List uploaded Semgrep Code (SAST) findings, bounded and repository-scoped. Risk=READ; approval=false.")
    async def finding_code_list(input: FindingsInput) -> Any:
        return await _findings(input, "ISSUE_TYPE_SAST")

    @mcp.tool(name="semgrep.finding.supply_chain.list", description="List uploaded Semgrep Supply Chain (SCA) findings, bounded and repository-scoped. Risk=READ; approval=false.")
    async def finding_supply_chain_list(input: FindingsInput) -> Any:
        return await _findings(input, "ISSUE_TYPE_SCA")

    @mcp.tool(name="semgrep.scan.supply_chain", description="Run the official Semgrep MCP supply-chain scan for the configured workspace. Risk=READ; approval=false.")
    async def scan_supply_chain() -> Any:
        return await client.call("semgrep_scan_supply_chain", {})

    return mcp


def main() -> None:
    create_server().run(transport="stdio")


if __name__ == "__main__":
    main()
