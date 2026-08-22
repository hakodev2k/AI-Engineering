import json
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'watcher_budget.py'


def run(tmp_path, paths, limit):
    p = tmp_path / 'paths.txt'
    p.write_text('\n'.join(paths), encoding='utf-8')
    cp = subprocess.run([sys.executable, str(SCRIPT), '--paths', str(p), '--limit', str(limit)], text=True, capture_output=True)
    return cp.returncode, json.loads(cp.stdout)


def test_safe_and_classification(tmp_path):
    code, data = run(tmp_path, ['/repo/src/a.py', '/repo/.venv/lib/x.py', '/repo/.git/objects/aa/bb'], 10)
    assert code == 0
    assert data['verdict'] == 'safe'
    assert data['categories']['dependency'] == 1
    assert data['categories']['git-internal'] == 1


def test_warn_threshold(tmp_path):
    code, data = run(tmp_path, [f'/repo/src/{i}.py' for i in range(6)], 10)
    assert code == 1
    assert data['verdict'] == 'warn'


def test_block_threshold(tmp_path):
    code, data = run(tmp_path, [f'/repo/node_modules/p/{i}.js' for i in range(8)], 10)
    assert code == 3
    assert data['verdict'] == 'block-new'
    assert data['high_noise_count'] == 8


def test_invalid_limit(tmp_path):
    p = tmp_path / 'paths.txt'
    p.write_text('/repo/src/a.py', encoding='utf-8')
    cp = subprocess.run([sys.executable, str(SCRIPT), '--paths', str(p), '--limit', '0'], text=True, capture_output=True)
    assert cp.returncode == 2
