import json,subprocess,sys,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; SCRIPT=ROOT/'scripts/analyze_input_trace.py'
def tr(gaps):
 f=tempfile.NamedTemporaryFile('w',encoding='utf-8',delete=False); t=0
 for i,g in enumerate(gaps): t+=int(g*1e6); f.write(json.dumps({'t_ns':t,'x':i,'y':0,'gap_ms':g})+'\n')
 f.close(); return f.name
def run(a,b):
 p=subprocess.run([sys.executable,str(SCRIPT),a,'--baseline',b],capture_output=True,text=True); return p.returncode,json.loads(p.stdout)
def test_stable_pair_passes():
 c,r=run(tr([2.2]*150),tr([2.0]*150)); assert c==0 and r['decision']=='pass'
def test_stalls_fail():
 c,r=run(tr([2.0]*180+[40.0]*20),tr([2.0]*200)); assert c==10 and 'max_gap' in r['reasons'] and 'over_16ms_rate' in r['reasons']
def test_too_few_events_fail():
 c,r=run(tr([2.0]*20),tr([2.0]*20)); assert c==10 and 'insufficient_affected_events' in r['reasons']
