#!/usr/bin/env python3
import argparse,json,re,sys
from pathlib import Path
INSTRUCTION=re.compile(r'(?i)(ignore\s+(previous|prior)|system\s+prompt|developer\s+message|run\s+(this|the)\s+command|execute\s+|sudo\s+|curl\s+.+\|\s*(sh|bash)|powershell\s+-|rm\s+-rf|drop\s+table|force\s+push)')
SECRET=re.compile(r'(?i)(api[_-]?key|authorization|bearer|password|secret|token)\s*[:=]\s*[^\s,;]{8,}')

def main():
 p=argparse.ArgumentParser();p.add_argument('path');p.add_argument('--source',default='tool-output');p.add_argument('--json-out');a=p.parse_args()
 f=Path(a.path)
 if not f.is_file(): print('input file not found',file=sys.stderr);return 2
 text=f.read_text(encoding='utf-8',errors='replace'); findings=[]
 for name,rx,risk in [('instruction-like',INSTRUCTION,'high'),('secret-like',SECRET,'critical')]:
  for m in rx.finditer(text):
   line=text.count('\n',0,m.start())+1
   findings.append({'kind':name,'source':a.source,'line':line,'risk':risk,'excerpt':m.group(0)[:120]})
 out={'status':'blocked' if findings else 'pass','findings':findings}
 rendered=json.dumps(out,indent=2)
 if a.json_out: Path(a.json_out).write_text(rendered+'\n',encoding='utf-8')
 print(rendered);return 1 if findings else 0
if __name__=='__main__': raise SystemExit(main())
