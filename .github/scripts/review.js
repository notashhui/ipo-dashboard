import Anthropic from "@anthropic-ai/sdk";
import { execSync } from "child_process";
import { readFileSync } from "fs";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
// Get git diff for this PR
const diff = execSync(
  `git diff ${process.env.BASE_SHA}..${process.env.HEAD_SHA} \
  -- "*.js" "*.ts" "*.py" "*.go" "*.java" "*.sol"`,
  { maxBuffer: 1024 * 1024 * 5 }
).toString();
if (!diff.trim()) {
  console.log("No code changes detected, skipping review.");
  process.exit(0);
}
// Load system prompt
const systemPrompt = readFileSync(
  ".github/scripts/prompt.md",
  "utf-8"
);
// Truncate diff if too large (keep first 80k chars)
const truncated = diff.length > 80000
  ? diff.slice(0, 80000) + "\n\n[... diff truncated ...]"
  : diff;
// Call Claude
const message = await client.messages.create({
  model: "claude-opus-4-5",
  max_tokens: 2048,
  system: systemPrompt,
  messages: [
    {
      role: "user",
      content: `Please review this pull request diff:\n\n\`\`\`diff\n${truncated}\n\`\`\``
    }
  ]
});
const review = message.content[0].text;
// Post as PR comment via GitHub API
const [owner, repo] = process.env.REPO.split("/");
const response = await fetch(
  `https://api.github.com/repos/${owner}/${repo}/issues/${process.env.PR_NUMBER}/comments`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json"
    },
    body: JSON.stringify({ body: review })
  }
);
if (!response.ok) {
  console.error("Failed to post comment:", await response.text());
  process.exit(1);
}
console.log("AI review posted successfully.");
