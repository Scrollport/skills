# Security policy

Report a suspected vulnerability privately through
[GitHub private vulnerability reporting](https://github.com/Scrollport/skills/security/advisories/new)
or email `security@scrollport.com`. Do not open a public issue for a secret,
credential, private customer record or exploitable workflow.

Skills are instructions executed by an agent in the user's environment. Treat
their files and retrieved content as untrusted input, keep credentials in the
host's secret store, inspect tool contracts before paid calls, preserve human
approval for external writes and never weaken a host's sandbox or permissions.

The repository validation rejects common credential formats, but automated
scanning is a backstop rather than permission to include sensitive evidence.
