import json
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "provenance_gate.py"


def run(tmp_path, *args, env=None):
    return subprocess.run([sys.executable, str(SCRIPT), *args], cwd=tmp_path, capture_output=True, text=True, env=env)


def init_repo(tmp_path):
    subprocess.run(["git", "init"], cwd=tmp_path, check=True, capture_output=True)
    subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=tmp_path, check=True)
    subprocess.run(["git", "config", "user.name", "Test"], cwd=tmp_path, check=True)
    (tmp_path / "seed.txt").write_text("seed", encoding="utf-8")
    subprocess.run(["git", "add", "."], cwd=tmp_path, check=True)
    subprocess.run(["git", "commit", "-m", "seed"], cwd=tmp_path, check=True, capture_output=True)


def write_policy(tmp_path):
    (tmp_path / "config").mkdir()
    (tmp_path / "config" / "policy.yaml").write_text(
        "require_manifest: true\nrequire_build_commit_match: true\nmax_manifest_entries: 50\nartifact_roots:\n  - artifacts\nignore_patterns:\n  - '*.log'\n",
        encoding="utf-8",
    )


def test_write_then_verify_manifest(tmp_path):
    init_repo(tmp_path)
    write_policy(tmp_path)
    (tmp_path / "artifacts").mkdir()
    (tmp_path / "artifacts" / "app.bin").write_bytes(b"abc")
    first = run(tmp_path, "--write-manifest")
    assert first.returncode == 0, first.stderr
    second = run(tmp_path)
    assert second.returncode == 0, second.stdout + second.stderr
    result = json.loads((tmp_path / "provenance-result.json").read_text())
    assert result["status"] == "verified"


def test_detects_tampering(tmp_path):
    init_repo(tmp_path)
    write_policy(tmp_path)
    (tmp_path / "artifacts").mkdir()
    p = tmp_path / "artifacts" / "app.bin"
    p.write_bytes(b"abc")
    assert run(tmp_path, "--write-manifest").returncode == 0
    p.write_bytes(b"tampered")
    result = run(tmp_path)
    assert result.returncode == 2
    parsed = json.loads((tmp_path / "provenance-result.json").read_text())
    assert any(f["code"] == "ARTIFACT_HASH_MISMATCH" for f in parsed["findings"])


def test_detects_expected_commit_mismatch(tmp_path):
    init_repo(tmp_path)
    write_policy(tmp_path)
    (tmp_path / "artifacts").mkdir()
    (tmp_path / "artifacts" / "app.bin").write_bytes(b"abc")
    result = run(tmp_path, "--write-manifest", "--expected-commit", "deadbeef")
    assert result.returncode == 2
