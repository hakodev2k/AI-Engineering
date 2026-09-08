from __future__ import annotations

from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, field_validator


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class CodeFile(StrictModel):
    path: str = Field(min_length=1, max_length=500)
    content: str

    @field_validator("path")
    @classmethod
    def safe_relative_path(cls, value: str) -> str:
        normalized = value.replace("\\", "/")
        if normalized.startswith("/") or ".." in normalized.split("/"):
            raise ValueError("path must be relative and cannot traverse directories")
        return normalized


class ContentScanInput(StrictModel):
    files: list[CodeFile]


class LocalScanInput(StrictModel):
    paths: list[str]


class CustomRuleScanInput(ContentScanInput):
    rule_yaml: str = Field(min_length=1, max_length=200_000)


class AstInput(StrictModel):
    code: str
    language: str = Field(min_length=1, max_length=64, pattern=r"^[A-Za-z0-9_+#.-]+$")


class FindingsInput(StrictModel):
    repositories: list[str] = Field(min_length=1, max_length=50)
    status: Literal["ISSUE_TAB_OPEN", "ISSUE_TAB_CLOSED", "ISSUE_TAB_IGNORED", "ISSUE_TAB_REVIEWING", "ISSUE_TAB_FIXING"] = "ISSUE_TAB_OPEN"
    severities: list[Literal["SEVERITY_CRITICAL", "SEVERITY_HIGH", "SEVERITY_MEDIUM", "SEVERITY_LOW"]] | None = None
    refs: list[str] = Field(default_factory=list, max_length=50)
    limit: int = Field(default=20, ge=1, le=100)
