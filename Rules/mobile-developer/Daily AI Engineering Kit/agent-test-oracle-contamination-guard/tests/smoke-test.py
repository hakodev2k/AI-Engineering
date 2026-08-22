#!/usr/bin/env python3
import json, pathlib, subprocess, sys, tempfile

ROOT=pathlib.Path(__file__).resolve().parents[1]
SCRIPTS=ROOT/'scripts'
POLICY=ROOT/'config'/'oracle-policy.json'

def write(path,obj):
    path.write_text(json.dumps(obj,indent=2)+'\n',encoding='utf-8')

def run(script,args,expected=0):
    r=subprocess.run([sys.executable,str(SCRIPTS/script),*map(str,args)],text=True,capture_output=True)
    if r.returncode!=expected:
        raise AssertionError(f'{script} exit={r.returncode} expected={expected}\nstdout={r.stdout}\nstderr={r.stderr}')
    return r

with tempfile.TemporaryDirectory(prefix='oracle-guard-') as td:
    t=pathlib.Path(td)
    repo=t/'repo'; repo.mkdir(); (repo/'.git').mkdir(); (repo/'tests').mkdir()
    (repo/'tests'/'sample_test.py').write_text("def test_total():\n    assert compute_total() == 10\n",encoding='utf-8')
    assertions=t/'assertions.json'
    run('extract-test-assertions.py',['--repo',repo,'--output',assertions])
    inv=json.loads(assertions.read_text())
    assert inv['count']==1

    clean=[{
      'id':'c1','behavior':'fixed public result','expected':10,'risk':'low',
      'source':'requirements/example.md#result','source_type':'acceptance-criteria','independent':True,
      'evidence':['The accepted result is 10.'],'implementation_symbols':[],'tags':[]
    }]
    cleanp=t/'clean.json'; write(cleanp,clean)
    contamination=t/'clean-contamination.json'
    run('detect-oracle-contamination.py',['--claims',cleanp,'--assertions',assertions,'--policy',POLICY,'--output',contamination])
    gate=t/'clean-gate.json'
    run('evaluate-oracle-gate.py',['--claims',cleanp,'--contamination',contamination,'--policy',POLICY,'--output',gate])
    assert json.loads(gate.read_text())['status']=='verified'

    bad=[{
      'id':'c2','behavior':'mirrored current result','expected':10,'risk':'low',
      'source':'src/calculator.py','source_type':'current-branch-behavior','independent':False,
      'evidence':['Observed current implementation output.'],'implementation_symbols':['compute_total'],'tags':[]
    }]
    badp=t/'bad.json'; write(badp,bad)
    badc=t/'bad-contamination.json'
    run('detect-oracle-contamination.py',['--claims',badp,'--assertions',assertions,'--policy',POLICY,'--output',badc],1)
    assert json.loads(badc.read_text())['blockers']

    high=[{
      'id':'c3','behavior':'authorization decision','expected':'deny','risk':'high',
      'source':'requirements/security.md#authorization','source_type':'domain-rule','independent':True,
      'evidence':['Missing permission must be denied.'],'implementation_symbols':[],'tags':['security']
    }]
    highp=t/'high.json'; write(highp,high)
    highc=t/'high-contamination.json'
    run('detect-oracle-contamination.py',['--claims',highp,'--assertions',assertions,'--policy',POLICY,'--output',highc])
    highgate=t/'high-gate.json'
    run('evaluate-oracle-gate.py',['--claims',highp,'--contamination',highc,'--policy',POLICY,'--output',highgate],1)
    assert 'required-mutation-evidence-missing' in json.loads(highgate.read_text())['blockers']

    mutation=t/'mutation.json'; write(mutation,{'mutants':5,'killed':4})
    fingerprint=t/'fp.json'
    run('fingerprint-oracle.py',['--claims',highp,'--policy',POLICY,'--output',fingerprint])
    fp=json.loads(fingerprint.read_text())['oracle_fingerprint']
    selfreview=t/'self-review.json'; write(selfreview,{
      'version':'1.0.0','oracle_fingerprint':fp,'reviewer':'impl','implementation_owner':'impl','verdict':'approved','findings':[]
    })
    run('evaluate-oracle-gate.py',['--claims',highp,'--contamination',highc,'--policy',POLICY,'--mutation',mutation,'--review',selfreview,'--implementation-owner','impl','--output',t/'self-gate.json'],1)

    review=t/'review.json'; write(review,{
      'version':'1.0.0','oracle_fingerprint':fp,'reviewer':'independent','implementation_owner':'impl','verdict':'approved','findings':['source verified','mutation evidence sufficient']
    })
    final=t/'final.json'
    run('evaluate-oracle-gate.py',['--claims',highp,'--contamination',highc,'--policy',POLICY,'--mutation',mutation,'--review',review,'--implementation-owner','impl','--output',final])
    assert json.loads(final.read_text())['status']=='verified'

print('smoke-test: PASS')
