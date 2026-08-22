#!/usr/bin/env python3
"""Run authorization matrix tests against check_authorization.py. Python 3.9+."""
import argparse, subprocess, sys
from pathlib import Path

CASES=[
 ("valid-read",0,["--principal","alice","--issuer","https://issuer.example.com","--audience","https://mcp.example.com","--resource","repo:alpha","--tool","repo.read","--action","read","--session-owner","alice"]),
 ("wrong-audience",1,["--principal","alice","--issuer","https://issuer.example.com","--audience","https://other.example.com","--resource","repo:alpha","--tool","repo.read","--action","read","--session-owner","alice"]),
 ("cross-session",1,["--principal","bob","--issuer","https://issuer.example.com","--audience","https://mcp.example.com","--resource","repo:beta","--tool","repo.read","--action","read","--session-owner","alice"]),
 ("cross-resource",1,["--principal","bob","--issuer","https://issuer.example.com","--audience","https://mcp.example.com","--resource","repo:alpha","--tool","repo.read","--action","read","--session-owner","bob"]),
 ("ungranted-tool",1,["--principal","bob","--issuer","https://issuer.example.com","--audience","https://mcp.example.com","--resource","repo:beta","--tool","repo.write","--action","write","--session-owner","bob"]),
 ("missing-approval",1,["--principal","alice","--issuer","https://issuer.example.com","--audience","https://mcp.example.com","--resource","repo:alpha","--tool","repo.write","--action","write","--session-owner","alice"]),
 ("approved-write",0,["--principal","alice","--issuer","https://issuer.example.com","--audience","https://mcp.example.com","--resource","repo:alpha","--tool","repo.write","--action","write","--session-owner","alice","--approved"])
]

def main():
 p=argparse.ArgumentParser(); p.add_argument("--policy",required=True); a=p.parse_args()
 checker=Path(__file__).with_name("check_authorization.py"); failed=0
 for name,expected,args in CASES:
  r=subprocess.run([sys.executable,str(checker),"--policy",a.policy,*args],capture_output=True,text=True)
  ok=r.returncode==expected; print(f"{'PASS' if ok else 'FAIL'} {name}: {r.stdout.strip()}")
  failed += 0 if ok else 1
 print(f"{len(CASES)-failed}/{len(CASES)} cases passed")
 return 1 if failed else 0
if __name__=="__main__": sys.exit(main())
