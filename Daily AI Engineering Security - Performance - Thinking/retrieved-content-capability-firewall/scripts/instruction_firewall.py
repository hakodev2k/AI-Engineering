#!/usr/bin/env python3
import argparse,json,re,sys
from pathlib import Path
RULES={
'credential_access':[r'\b(?:read|open|cat|print|dump|send|upload|exfiltrat\w*)\b.{0,80}\b(?:\.env|credential|api[_ -]?key|token|secret|password)\b',r'\b(?:AWS_SECRET_ACCESS_KEY|OPENAI_API_KEY|ANTHROPIC_API_KEY|GITHUB_TOKEN)\b'],
'external_exfiltration':[r'\b(?:curl|wget|invoke-webrequest|fetch)\b.{0,160}\bhttps?://',r'\b(?:webhook|attacker[- ]controlled|exfiltrat\w*|send\s+(?:it|data|secret|token))\b'],
'destructive_file_action':[r'\b(?:rm\s+-rf|rmdir\s+/s|del\s+/[fsq]|remove-item\b.{0,40}-recurse)\b',r'\b(?:delete|erase|wipe)\b.{0,80}\b(?:file|directory|folder|repository|workspace)\b'],
'shell_install_or_download':[r'\b(?:npx|npm|pnpm|yarn|pip|pipx|uv|cargo|brew|choco|winget)\b.{0,120}(?:\b(?:install|add|exec|dlx|--yes)\b|\s-y\b)',r'\b(?:curl|wget)\b.{0,160}\|\s*(?:sh|bash|zsh|pwsh|powershell)\b'],
'assistant_directive':[r'\b(?:assistant|model|agent)\s*:\s*',r'\b(?:ignore|disregard|override)\b.{0,80}\b(?:previous|system|developer|user|instruction|policy)\b',r'\b(?:you must|you should|please)\b.{0,100}\b(?:run|execute|open|read|send|upload|delete|install)\b']}
def scan(text):
 out=[]; seen=set()
 for cat,pats in RULES.items():
  for pat in pats:
   for m in re.finditer(pat,text,re.I|re.S):
    k=(cat,m.start(),m.end())
    if k not in seen:
     seen.add(k); out.append({'category':cat,'match':re.sub(r'\s+',' ',m.group(0))[:240],'start':m.start(),'end':m.end()})
 return sorted(out,key=lambda x:(x['start'],x['category']))
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('input'); ap.add_argument('--policy',default=str(Path(__file__).resolve().parents[1]/'config/policy.json')); ap.add_argument('--json',action='store_true'); a=ap.parse_args()
 try: text=Path(a.input).read_text(encoding='utf-8',errors='replace'); policy=json.loads(Path(a.policy).read_text())
 except (OSError,json.JSONDecodeError) as e: print(f'error: {e}',file=sys.stderr); return 2
 findings=scan(text); blockers=[f for f in findings if f['category'] in set(policy.get('block_on',[]))]
 decision='block' if len(blockers)>=int(policy.get('max_findings_before_block',1)) else ('review' if findings else 'allow')
 report={'decision':decision,'findings':findings,'blocking_findings':blockers,'input':a.input}
 print(json.dumps(report,indent=2) if a.json else f"decision={decision} findings={len(findings)} blocking={len(blockers)}")
 return 10 if decision=='block' else (5 if decision=='review' else 0)
if __name__=='__main__': raise SystemExit(main())
