#!/usr/bin/env python3
import hashlib, json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POLICY = ROOT / 'config' / 'secret-reference-policy.json'
SCAN = ROOT / 'scripts' / 'scan-secret-references.py'
VALIDATE = ROOT / 'scripts' / 'validate-secret-inventory.py'
GATE = ROOT / 'scripts' / 'evaluate-secret-integrity-gate.py'


def run(args, expected=(0,)):
    p = subprocess.run([sys.executable, *map(str, args)], text=True, capture_output=True)
    if p.returncode not in expected:
        raise AssertionError(f"command failed rc={p.returncode}\nstdout={p.stdout}\nstderr={p.stderr}")
    return p


def load(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def write(path, value):
    Path(path).write_text(json.dumps(value, indent=2) + '\n', encoding='utf-8')


def make_review(inventory_payload, status='verified', reviewer='independent-reviewer', findings=None):
    inv = inventory_payload['inventory']
    return {
        'inventory_fingerprint': inventory_payload['inventory_fingerprint'],
        'reviewer_id': reviewer,
        'reviewed_head': inv['head'],
        'status': status,
        'findings': findings or [],
        'approval': None
    }


def main():
    with tempfile.TemporaryDirectory() as td:
        repo = Path(td) / 'repo'; repo.mkdir()
        (repo / '.github' / 'workflows').mkdir(parents=True)
        workflow = repo / '.github' / 'workflows' / 'deploy.yml'
        workflow.write_text('env:\n  PAYMENTS_API_KEY: ${{ secrets.PAYMENTS_API_KEY }}\n', encoding='utf-8')
        subprocess.run(['git','init'], cwd=repo, check=True, capture_output=True)
        subprocess.run(['git','config','user.email','test@example.com'], cwd=repo, check=True)
        subprocess.run(['git','config','user.name','Smoke Test'], cwd=repo, check=True)
        subprocess.run(['git','add','.'], cwd=repo, check=True)
        subprocess.run(['git','commit','-m','fixture'], cwd=repo, check=True, capture_output=True)

        contracts = Path(td) / 'contracts.json'
        write(contracts, {'contracts':[{
            'name':'PAYMENTS_API_KEY','source_kind':'github-actions-secret','scope':'production','required':True,
            'consumers':['.github/workflows/deploy.yml'],'aliases':[],
            'description':'name only','provisioning_reference':'runbook://payments'
        }]})
        inventory = Path(td) / 'inventory.json'
        validation = Path(td) / 'validation.json'
        review = Path(td) / 'review.json'
        gate = Path(td) / 'gate.json'

        run([SCAN,'--repo',repo,'--policy',POLICY,'--contracts',contracts,'--output',inventory])
        run([VALIDATE,'--inventory',inventory,'--policy',POLICY,'--output',validation])
        inv_payload = load(inventory)
        write(review, make_review(inv_payload))
        run([GATE,'--inventory',inventory,'--validation',validation,'--review',review,'--policy',POLICY,'--implementation-owner','implementation-agent','--output',gate])
        assert load(gate)['status'] == 'verified'

        # Unknown renamed reference must fail closed.
        workflow.write_text('env:\n  PAYMENTS_API_KEY_V2: ${{ secrets.PAYMENTS_API_KEY_V2 }}\n', encoding='utf-8')
        inventory2 = Path(td) / 'inventory2.json'; validation2 = Path(td) / 'validation2.json'
        run([SCAN,'--repo',repo,'--policy',POLICY,'--contracts',contracts,'--output',inventory2])
        run([VALIDATE,'--inventory',inventory2,'--policy',POLICY,'--output',validation2], expected=(2,))
        result2 = load(validation2)
        assert result2['status'] == 'blocked'
        assert 'PAYMENTS_API_KEY_V2' in result2['unknown_references']

        # Alias is not silently accepted; it requires review.
        alias_contracts = Path(td) / 'alias-contracts.json'
        write(alias_contracts, {'contracts':[{
            'name':'PAYMENTS_API_KEY','source_kind':'github-actions-secret','scope':'production','required':True,
            'consumers':['.github/workflows/deploy.yml'],'aliases':['PAYMENTS_API_KEY_V2'],
            'description':'temporary migration alias','provisioning_reference':'runbook://payments'
        }]})
        inventory3 = Path(td) / 'inventory3.json'; validation3 = Path(td) / 'validation3.json'
        run([SCAN,'--repo',repo,'--policy',POLICY,'--contracts',alias_contracts,'--output',inventory3])
        run([VALIDATE,'--inventory',inventory3,'--policy',POLICY,'--output',validation3], expected=(3,))
        assert load(validation3)['status'] == 'review-required'

        # A stale review fingerprint must block final verification.
        stale_review = make_review(load(inventory3))
        stale_review['inventory_fingerprint'] = hashlib.sha256(b'stale').hexdigest()
        review3 = Path(td) / 'review3.json'; gate3 = Path(td) / 'gate3.json'
        write(review3, stale_review)
        run([GATE,'--inventory',inventory3,'--validation',validation3,'--review',review3,'--policy',POLICY,'--implementation-owner','implementation-agent','--output',gate3], expected=(2,))
        assert load(gate3)['status'] == 'blocked'

    print('smoke-test: PASS')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
