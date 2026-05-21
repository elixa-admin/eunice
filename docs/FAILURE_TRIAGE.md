# Failure Triage

Use this when a command, connector, or deployment path keeps timing out or failing.

## Goal

Fail fast, classify the cause, switch to the right fallback, and capture repeat issues in the QuickFix knowledgebase.

## Retry Rule

- Retry once for a likely transient failure.
- Retry up to three times only if the failure looks network-related or the upstream service is clearly unstable.
- If the same failure repeats after a few retries, stop guessing and classify it.

## Classification

### Network Related

Likely signals:

- timeouts
- DNS or host resolution failures
- TLS or certificate issues
- 5xx responses
- rate limiting
- services that hang before returning any response

Fallback:

- switch to a local or cached path if possible
- retry later rather than burning more commands
- use an alternate service path only if it is already available and safe

### Config Related

Likely signals:

- wrong project or root directory
- missing env vars
- invalid auth or expired tokens
- bad workspace link
- CLI commands pointing at the wrong folder
- settings that work in one surface but not another

Fallback:

- inspect the local config
- re-link the project or re-run setup
- pull settings again
- correct the workspace path before retrying the same command

### Code Related

Likely signals:

- lint, typecheck, build, or runtime failures
- route crashes
- broken imports or missing modules
- regression after a code change
- repeated test failures in the same area

Fallback:

- isolate the smallest failing slice
- fix the code or revert the last change that introduced the issue
- prefer focused verification over repeated full-project retries

## Escalation Path

1. Retry once if the failure looks transient.
2. Classify it as network, config, or code if it repeats.
3. Switch to the right fallback instead of repeating the same command.
4. If the same bug shows up again later, add it to the QuickFix knowledgebase.

## QuickFix Rule

- If a fix is found and the same problem recurs, document it.
- If a failure wastes more than one session or appears twice, capture it.
- If a workaround is safer than the original path, record the workaround clearly.

