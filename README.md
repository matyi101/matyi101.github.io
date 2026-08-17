# PMI-ACP Practice Web — 12 Sets × 30 Questions

This static site combines the supplied Practice Test 1 (Q1–120), Practice Test 2 (Q121–240), and Practice Test 3 (Q241–360), then divides the full sequence into 12 web tests of 30 questions each.

## Set mapping

| Web set | Questions |
|---|---|
| 1 | 1–30 |
| 2 | 31–60 |
| 3 | 61–90 |
| 4 | 91–120 |
| 5 | 121–150 |
| 6 | 151–180 |
| 7 | 181–210 |
| 8 | 211–240 |
| 9 | 241–270 |
| 10 | 271–300 |
| 11 | 301–330 |
| 12 | 331–360 |

## Test behavior

- 30 multiple-choice questions per set.
- Correct answers and explanations are hidden until **Submit Test & Calculate Score** is pressed.
- After submission, the site shows percentage, correct, incorrect, unanswered, and unscored counts.
- A full answer/explanation review is shown at the end of the set, including the user's selected answer.
- Unanswered scorable questions count as incorrect.
- Progress is stored in `localStorage` in the user's browser.

## Source exceptions preserved

- **Question 70:** the supplied source contains the question and choices but no answer or explanation. It is included in Web Set 3 but excluded from scoring. Therefore Web Set 3 is scored out of 29 source-scorable questions.
- **Question 193:** the source omits a literal `Answer:` line, but its explanation explicitly identifies option **B** as the solution. The site scores it as B and notes this in the review.
- **Question 197:** the source contains a revised answer identifying option **C**. The site uses C.

## Publish with GitHub Pages

1. Create or choose a GitHub repository for the site.
2. Upload the contents of this folder to the repository root (so `index.html` is at the root).
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your default branch (usually `main`) and `/ (root)`, then save.
6. GitHub will display the Pages URL after deployment completes.

The site uses only HTML, CSS, and JavaScript; no server or build step is required.

## Publishing note

The question bank and explanations originate from material supplied in the conversation. Confirm that you have the necessary rights or permission before publishing copyrighted question content in a public repository or public GitHub Pages site.
