#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCAN = ROOT / 'scripts' / 'scan-timeout-risk.py'
VALIDATE = ROOT / 'scripts' / 'validate-assessment.py'
EXAMPLE = ROOT / 'examples' / 'example-assessment.json'


def run(*args):
    return subprocess.run([sys.executable, *map(str, args)], text=True, capture_output=True)


def assert_true(value, message):
    if not value:
        raise AssertionError(message)


def main():
    valid = run(VALIDATE, EXAMPLE)
    assert_true(valid.returncode == 0, f'example assessment failed validation: {valid.stdout} {valid.stderr}')
    assert_true('VALID' in valid.stdout, 'validator did not emit VALID')

    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        (root / 'safe.cs').write_text('public class SafeClient { public async Task RunAsync() { await Task.Yield(); } }', encoding='utf-8')
        safe = run(SCAN, root, '--json')
        assert_true(safe.returncode == 0, f'safe fixture unexpectedly risky: {safe.stdout}')
        safe_data = json.loads(safe.stdout)
        assert_true(safe_data['score'] == 0, 'safe fixture score must be zero')

        (root / 'risky.cs').write_text('''
using System;
using System.Threading;
using System.Threading.Tasks;
class Risky {
  async Task RunAsync() {
    var timeout = 5000;
    var x = SomeAsync().Result;
    catchMarker();
  }
  void Configure(System.Net.Http.HttpClient c) { c.Timeout = Timeout.InfiniteTimeSpan; }
}
''', encoding='utf-8')
        risky = run(SCAN, root, '--json')
        assert_true(risky.returncode == 2, f'risky fixture should block: {risky.stdout}')
        risky_data = json.loads(risky.stdout)
        assert_true(risky_data['score'] >= 6, 'risky fixture score must reach block threshold')

        bad = json.loads(EXAMPLE.read_text(encoding='utf-8'))
        bad['status'] = 'pass'
        bad['verification']['result'] = 'failed'
        bad_path = root / 'bad.json'
        bad_path.write_text(json.dumps(bad), encoding='utf-8')
        invalid = run(VALIDATE, bad_path)
        assert_true(invalid.returncode == 2, 'invalid pass assessment must be rejected')

    print('SELF-TEST PASS')


if __name__ == '__main__':
    main()
