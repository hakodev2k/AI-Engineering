#!/usr/bin/env python3
import argparse,json,re
from pathlib import Path
ZERO_WIDTH={"\u200b","\u200c","\u200d","\u2060","\ufeff"}
COMMENT_RE=re.compile(r"<!--.*?-->",re.DOTALL)
TAG_RE=re.compile(r"<\s*(script|style)\b.*?>.*?<\s*/\s*\1\s*>",re.I|re.S)
def load_policy(path):
 obj=json.loads(Path(path).read_text(encoding="utf-8"))
 if not isinstance(obj,dict): raise ValueError("policy must be an object")
 return obj
def inspect(raw,policy,requested_action=None,visible_evidence=None):
 reasons=[]; findings=[]
 if len(raw)>int(policy.get("max_input_chars",200000)): reasons.append("input_too_large")
 comments=COMMENT_RE.findall(raw)
 if comments:
  findings.append({"kind":"html_comment","count":len(comments)})
  if policy.get("block_html_comments",True): reasons.append("hidden_html_comment")
 zw=[c for c in raw if c in ZERO_WIDTH]
 if zw:
  findings.append({"kind":"zero_width","count":len(zw)})
  if policy.get("block_zero_width",True): reasons.append("zero_width_character")
 blocked={x.lower() for x in policy.get("blocked_tags",["script","style"])}
 for m in TAG_RE.finditer(raw):
  tag=m.group(1).lower()
  if tag in blocked: findings.append({"kind":"hidden_or_executable_tag","tag":tag}); reasons.append("blocked_hidden_tag:"+tag)
 privileged=set(policy.get("privileged_actions",[]))
 if requested_action in privileged and policy.get("require_visible_evidence_for_privileged_action",True) and not (visible_evidence or "").strip(): reasons.append("privileged_action_without_visible_evidence")
 decision="allow_visible_data" if not reasons else "quarantine_hidden_content"
 if "privileged_action_without_visible_evidence" in reasons: decision="block_privileged_action"
 return {"ok":not reasons,"decision":decision,"reasons":sorted(set(reasons)),"findings":findings}
def main():
 ap=argparse.ArgumentParser(); ap.add_argument("--input",required=True); ap.add_argument("--policy",required=True); ap.add_argument("--requested-action"); ap.add_argument("--visible-evidence"); a=ap.parse_args()
 try:r=inspect(Path(a.input).read_text(encoding="utf-8"),load_policy(a.policy),a.requested_action,a.visible_evidence)
 except Exception as e: print(json.dumps({"ok":False,"decision":"block_invalid_input","reasons":[str(e)]})); return 2
 print(json.dumps(r,indent=2,sort_keys=True)); return 0 if r["ok"] else 3
if __name__=="__main__": raise SystemExit(main())
