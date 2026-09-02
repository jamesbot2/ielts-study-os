// Original targeted Reading drills — Matching Headings.

import type { PracticeSet } from "@/types/ielts";
import { targetedMeta, originalPassage, matchingQuestion } from "./helpers";

const p1 = originalPassage(
  "reading-targeted-matching-headings-01-p01",
  "The many lives of wetlands",
  [
    "Wetlands are among the most productive ecosystems on Earth, yet for much of history they were regarded as wasted land to be drained. Swamps and marshes were converted into farmland, and the wildlife they supported was treated as an obstacle to progress rather than a resource.",
    "The first role of a wetland is the most obvious one: it is a sponge. During heavy rain, marshland stores water and releases it slowly, flattening the flood peak that would otherwise rush downstream. Cities that have kept their upstream wetlands intact have repeatedly escaped damage that hit neighbouring towns.",
    "A second role is filtering. As water passes through reeds and sediment, fertilisers and other pollutants are trapped and broken down. Engineers now build artificial wetlands to treat wastewater, because a well-designed marsh can do the job of a mechanical plant at a fraction of the running cost.",
    "Wetlands are also nurseries. A large share of commercially fished species spend part of their lives among mangroves and salt marshes, and coastal wetlands shelter young fish from predators. Losing a hectare of nursery marsh can reduce fish catches many kilometres away.",
    "Finally, wetlands are climate actors. Although they cover a small fraction of the land surface, they store enormous quantities of carbon in their waterlogged soils. When wetlands are drained, that carbon is released, turning a sink into a source of greenhouse gases.",
    "The modern view is therefore the reverse of the old one. Far from being wasteland, wetlands are infrastructure: natural systems that deliver flood control, clean water, food security and carbon storage. The challenge is that their value appears only when they are gone.",
    "Conservation programmes now attempt to restore drained marshes by blocking old drainage channels and replanting native vegetation. Restoration is slow and expensive, but the alternative — losing the services wetlands provide — is slower and more expensive still.",
  ].join("\n\n"),
);

export const matchingHeadingsSet01: PracticeSet = {
  meta: targetedMeta("reading-targeted-matching-headings-01", "Matching headings — The many lives of wetlands", "academic", "matching_headings", 4),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "matching_headings",
  passages: [p1],
  questions: [
    matchingQuestion("matching_headings", "heading_matching", "reading-targeted-matching-headings-01-q01",
      "Choose the correct heading for each paragraph.",
      [
        { id: "i", text: "A natural sponge against floods" },
        { id: "ii", text: "From waste ground to natural infrastructure" },
        { id: "iii", text: "Cleaning water without machines" },
        { id: "iv", text: "Cradles of commercial fish" },
        { id: "v", text: "Carbon banks under threat" },
        { id: "vi", text: "An outdated prejudice" },
        { id: "vii", text: "Rebuilding what was drained" },
        { id: "viii", text: "A threat to farmland" },
        { id: "ix", text: "The cost of visiting wetlands" },
      ],
      [
        { id: "mh-01-p1", text: "Paragraph 1", correctOptionId: "vi" },
        { id: "mh-01-p2", text: "Paragraph 2", correctOptionId: "i" },
        { id: "mh-01-p3", text: "Paragraph 3", correctOptionId: "iii" },
        { id: "mh-01-p4", text: "Paragraph 4", correctOptionId: "iv" },
        { id: "mh-01-p5", text: "Paragraph 5", correctOptionId: "v" },
        { id: "mh-01-p6", text: "Paragraph 6", correctOptionId: "ii" },
        { id: "mh-01-p7", text: "Paragraph 7", correctOptionId: "vii" },
      ],
      "Headings capture each paragraph's main idea; distractors viii and ix are plausible but wrong in scope.", "reading-targeted-matching-headings-01-p01"),
  ],
};

const p2 = originalPassage(
  "reading-targeted-matching-headings-02-p01",
  "Working from home: what the surveys actually show",
  [
    "Remote work is often presented as a single revolution, but the experience differs sharply by job type. Software developers and writers have reported high satisfaction for years, while factory and retail workers have never had the option. Any generalisation about 'working from home' must start with that division.",
    "Productivity evidence is mixed. Some studies found that call-centre staff handled more enquiries from home, while others recorded a small decline when workers lacked a quiet room. The most consistent finding is not about output but about hours: remote workers tend to spread the same work over a longer day.",
    "One surprising pattern concerns training. Junior employees who started their careers remotely report fewer informal learning moments, such as overhearing a senior colleague handle a difficult call. Companies that ignore this may find, five years on, that a generation of staff has missed skills no course can fully replace.",
    "The property question is equally complicated. Firms that reduce office space report savings, but those savings are partly offset when employees require home-office equipment and higher energy costs. Several large employers have concluded that a smaller office plus a home-work allowance is not cheaper than a full office — merely different.",
    "The strongest evidence is about choice. Employees with some control over where they work report higher wellbeing than both full-time office staff and full-time remote staff. Rigidity, rather than either location, appears to be what people dislike most.",
    "Managers often ask whether remote work should be permanent. The honest answer is that the question is badly framed: the useful question is which tasks, for which employees, in which roles, benefit from which setting — and how to let the answer vary.",
  ].join("\n\n"),
);

export const matchingHeadingsSet02: PracticeSet = {
  meta: targetedMeta("reading-targeted-matching-headings-02", "Matching headings — Working from home", "general", "matching_headings", 3),
  kind: "reading",
  practiceMode: "targeted",
  targetQuestionType: "matching_headings",
  passages: [p2],
  questions: [
    matchingQuestion("matching_headings", "heading_matching", "reading-targeted-matching-headings-02-q01",
      "Choose the correct heading for each paragraph.",
      [
        { id: "i", text: "A divided experience" },
        { id: "ii", text: "Longer days, similar output" },
        { id: "iii", text: "What junior staff lose" },
        { id: "iv", text: "Savings that are not savings" },
        { id: "v", text: "The value of choice" },
        { id: "vi", text: "Asking a better question" },
        { id: "vii", text: "The end of the office" },
        { id: "viii", text: "A technology problem" },
      ],
      [
        { id: "mh-02-p1", text: "Paragraph 1", correctOptionId: "i" },
        { id: "mh-02-p2", text: "Paragraph 2", correctOptionId: "ii" },
        { id: "mh-02-p3", text: "Paragraph 3", correctOptionId: "iii" },
        { id: "mh-02-p4", text: "Paragraph 4", correctOptionId: "iv" },
        { id: "mh-02-p5", text: "Paragraph 5", correctOptionId: "v" },
        { id: "mh-02-p6", text: "Paragraph 6", correctOptionId: "vi" },
      ],
      "Headings capture main ideas; vii and viii are distractors that overstate or misframe the text.", "reading-targeted-matching-headings-02-p01"),
  ],
};
