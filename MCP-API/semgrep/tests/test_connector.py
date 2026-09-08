from __future__ import annotations

from pathlib import Path
import pytest

from semgrep_connector.config import Config, load_config
from semgrep_connector.models import CodeFile, FindingsInput
from semgrep_connector.policy import validate_upstream_tool
from semgrep_connector.server import _check_content_limits, _check_local_paths


def cfg(**overrides):
    base = dict(binary="semgrep", app_token=None, timeout_seconds=120, max_code_bytes=1000, max_files=2)
    base.update(overrides)
    return Config(**base)


def test_config_rejects_binary_path():
    with pytest.raises(ValueError):
        load_config({"SEMGREP_BINARY": "/tmp/semgrep"})


def test_config_accepts_optional_token():
    value = load_config({"SEMGREP_BINARY": "semgrep", "SEMGREP_APP_TOKEN": "secret"})
    assert value.app_token == "secret"


def test_upstream_allowlist_blocks_unknown_tool():
    with pytest.raises(PermissionError):
        validate_upstream_tool("execute_arbitrary_request")


def test_code_file_rejects_traversal():
    with pytest.raises(ValueError):
        CodeFile(path="../secret.py", content="print('x')")


def test_content_limit_is_bounded():
    with pytest.raises(ValueError):
        _check_content_limits(cfg(max_code_bytes=1024), [CodeFile(path="a.py", content="x" * 1025)])


def test_findings_are_bounded():
    with pytest.raises(ValueError):
        FindingsInput(repositories=["a/b"], limit=101)


def test_local_paths_require_absolute_existing_files(tmp_path: Path):
    file = tmp_path / "a.py"
    file.write_text("print('ok')", encoding="utf-8")
    _check_local_paths([str(file.resolve())], 2)
    with pytest.raises(ValueError):
        _check_local_paths(["relative.py"], 2)
