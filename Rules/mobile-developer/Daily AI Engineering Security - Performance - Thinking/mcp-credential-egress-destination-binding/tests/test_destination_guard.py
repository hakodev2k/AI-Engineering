import json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "destination_guard.py"
POLICY = ROOT / "config" / "destination-policy.json"


def run(url):
    return subprocess.run([sys.executable, str(SCRIPT), url, "--credential-class", "amazon-mq", "--policy", str(POLICY), "--no-dns"], capture_output=True, text=True)


def test_approved_amazon_mq_host_allowed_offline():
    r = run("https://b-123.mq.amazonaws.com")
    assert r.returncode == 0, r.stderr + r.stdout
    assert json.loads(r.stdout)["decision"] == "allow"


def test_lookalike_suffix_denied():
    r = run("https://b-123.mq.amazonaws.com.attacker.example")
    assert r.returncode == 5


def test_base_domain_without_subdomain_denied():
    r = run("https://mq.amazonaws.com")
    assert r.returncode == 5


def test_ip_literal_denied():
    r = run("https://127.0.0.1")
    assert r.returncode == 5


def test_alternate_port_denied():
    r = run("https://b-123.mq.amazonaws.com:8443")
    assert r.returncode == 5


def test_userinfo_denied():
    r = run("https://user@b-123.mq.amazonaws.com")
    assert r.returncode == 5
