# How I build a system prompt, and how I prove it works
*Method piece. Illustrative examples; no employer-confidential material.*
Jaya Bhattacharya · jayabht.github.io

Most prompt writing I see is one long paragraph that grew by accretion — every production incident
added a sentence, nobody ever removed one, and eventually the instructions contradict each other and
the model picks a side at random. This is the structure I use instead, and the evaluation layer that
keeps it honest.

---

## 1. Five blocks, in this order

**1. Role and scope.** What the assistant is, and the boundary. The boundary belongs at the top, not
buried at the end where it competes with the examples.

**2. Behavioural rules, ranked.** Not a flat list — an ordered one, because rules collide in
production. "Be concise" and "always confirm the amount before paying" will meet, and the model needs
to know which wins. If I can't rank two rules, the spec isn't finished.

**3. Output contract.** Shape, length, what must never appear. Stated as a constraint, not a
preference: *"Never state an amount without its currency"* survives paraphrase; *"try to include the
currency"* does not.

**4. Few-shot examples — chosen for the edges.** Two or three, and never the happy path. Examples are
expensive context, so they should buy coverage of the cases the rules describe least well: the
ambiguous one, the refusal, the recovery-after-error.

**5. Edge-case instructions last.** Low-frequency, high-cost situations — the ones where getting it
wrong is expensive even though it happens rarely.

## 2. Two habits that do most of the work

**Separate the reasoning instruction from the formatting instruction.** Compressing both into one
directive is the most common cause of a fix that breaks something else: tighten the format and the
model quietly drops the reasoning step it was also carrying.

**Write the failing example, not just the rule.** A rule tells the model what to aim at. A worked ❌
tells it what the near-miss looks like — and gives QA a reference answer to score against. Every rule
I write ships with the wrong version next to it.

## 3. Failure taxonomy

When output is bad, "the prompt is bad" is not a diagnosis. I attribute failures to one of:

| Class | What it looks like | Where the fix goes |
|---|---|---|
| Instruction following | Rule exists, ignored | Rank it higher, or the rules contradict |
| Context carry-over | Turn-one constraint gone by turn five | Restate constraint in the turn contract |
| Grounding | Claim not supported by retrieved context | Retrieval, not the prompt |
| Retrieval | Right claim, wrong or missing source | Index and query, not the prompt |
| Tool selection | Right intent, wrong tool | Tool descriptions, not the system prompt |
| Parameter accuracy | Right tool, wrong arguments | Schema and examples |
| Sequencing | Right steps, wrong order or a skipped gate | Plan structure and permission gating |
| Tone | Correct, unusable | Voice rubric |

The value of the taxonomy is that it stops teams from patching the system prompt for a retrieval bug —
which is how prompts become the accretion paragraph in the first place.

## 4. The evaluation layer

**A rubric per dimension, not one holistic score.** Helpfulness, instruction following, factual
accuracy, context carry-over, tone, safety — scored separately, per turn, with a written justification.
A single 1–5 "quality" score tells you a version regressed; it never tells you what to change.

**Turn-level, then conversation-level.** Each assistant turn scored on its own, then a closing note on
the conversation: did it end in a resolved state, and what pattern recurred.

**Reference answers for failures.** When the model gets it wrong, I write the corrected response.
Those become the regression set — the cases every future revision must still pass.

**Grounding checks as a separate pass.** Every claim against retrieved context, flagging unsupported
statements, irrelevant retrievals and wrong citations, and separating retrieval failures from
generation failures so the fix lands in the right place.

**Agentic runs, scored by step.** For tool-using workflows: tool selection, parameter accuracy,
permission gating, step sequencing — each checked, each failure attributed to the step that broke.
Knowing whether the bad outcome came from the planner, the tool call or the final generation is the
difference between a fix that holds and a bug that relocates.

## 5. A worked before / after

**Before** — one instruction carrying three jobs:

> Answer the user's billing question concisely and politely, always being accurate about amounts and
> dates, and don't make things up.

It fails quietly. "Concisely" and "accurate about amounts and dates" compete; under pressure the model
drops the date. "Don't make things up" has no observable behaviour attached — there's nothing to score.

**After** — separated, ranked, and checkable:

> **Answer in at most two sentences.**
> **Every amount is stated with its currency and every date with its month.** If you cannot state both
> from the retrieved bill, say which one is missing and stop — do not estimate.
> If the retrieved context does not contain the answer, say so in the first clause and offer the one
> action that would get it.

Three separable rules, each with a failure mode you can write a test for, and an explicit ranking:
completeness of the figure beats brevity.

---

**Why this matters to a team:** the prompt stops being someone's private craft and becomes a reviewable
artifact — with a ranking to argue about, a rubric to score against, and a regression set that makes
"this change is safe" a claim with evidence behind it.
