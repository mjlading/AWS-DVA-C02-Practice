# Repository instructions

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for the full instructions that this file mirrors, so both GitHub Copilot and Claude-based agents follow the same guidance in this repo.

This repository is a set of practice questions and a small quiz app for the AWS Certified Developer - Associate (DVA-C02) exam.

## When explaining AWS services or answering questions about them

Answer with certification relevance in mind, not general background info.
Assume the reader is studying for the DVA-C02 exam and already knows the basics of AWS.

- Focus on what is actually testable on the DVA-C02 exam.
- Call out common exam traps and distractors (for example, services that sound similar but are tested against each other, like SQS vs SNS vs EventBridge, or Cognito User Pools vs Identity Pools).
- Compare the service or concept to the alternatives it is usually confused with, and explain when to pick one over another.
- Mention limits, defaults, and behaviors that exam questions like to probe (timeouts, retry behavior, encryption options, IAM permission models, deployment strategies, etc.) when relevant.
- Skip marketing language, pricing details, release history, and general background that is not exam-relevant unless directly asked for.
- Keep answers concise and scannable. Prefer short bullet points over long paragraphs.

## Repository layout

- `questions.js` is the Warmup bank (ids 1-65, easier than the real exam).
- `questions-exam.js` is The real deal bank (ids 101-165, written to the DVA-C02 exam guide v1.3 task statements).
- Each bank holds exactly 65 questions split 21/17/16/11 across Development with AWS Services, Security, Deployment, and Troubleshooting and Optimization, matching the 32/26/24/18 percent exam weights.
- `app.js` loads both banks and refuses to start a session unless each bank has 65 questions.

## When editing questions

- Keep the answer key, explanation, and reference URL consistent with current AWS documentation, and prefer the official docs as the reference.
- Distractors must be real AWS features or plausible misreadings, never invented services or settings.
- Multi-response questions need five or more options and `answers.length` equal to `selectCount`.
- Use a plain dash, never an em dash, in question text.
