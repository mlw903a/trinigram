# Trinigram — static site

A plain HTML/CSS/JS rebuild of trinigram.com for GitHub Pages. There is no build step, no backend,
no data storage, no analytics and no pixels. The only external request is Google Fonts
(Cormorant Garamond, Lora). The quiz runs entirely in the browser and sends nothing anywhere.

## Pages
| URL | File |
| --- | --- |
| `/` | `index.html` |
| `/assessment` | `assessment/index.html` (Trinigram Quiz) |
| `/dive-deeper` | `dive-deeper/index.html` (FAQ) |
| `/books-articles` | `books-articles/index.html` (Resources) |
| `/resources` | `resources/index.html` (sends you on to `/books-articles/`, as the old site did) |
| anything else | `404.html` |

Shared files: `css/style.css` and `js/quiz.js`. `CNAME` holds `trinigram.com`. `.nojekyll` turns off Jekyll processing.

## Quiz
There are 30 questions, 10 each for Glory (G), Pursuit (P) and Attunement (A). They appear one at a
time in random order. Each is answered from 0 (Never) to 5 (Always) and starts at 3, as on the original site.

Scoring is unchanged from the original:
1. Average the answers in each category (0–5).
2. Turn each average into a 0–100 score (average / 5 × 100).
3. Show each score as a share of the three scores' total, rounded. Any rounding leftover goes to the largest share, so the three always add to 100%.
4. Rank the shares. When neighbours are 5 points or more apart, they count as distinct: primary / secondary / growth, or primary plus two developing. When they are closer, they count as balanced: balanced-high or balanced. Each label picks the original paragraph for that dimension.

The only addition is a guard for all-zero answers: the original divided by zero there and showed "NaN%". This version shows an even 34/33/33 split instead.

## Editing resources
The Resources list is plain HTML in `books-articles/index.html`. It used to load from `/api/resources`.
To add a book or article, add an `<li>` to the right category list.

## Local preview
```
python3 -m http.server 8000   # run from this folder, then open http://localhost:8000/
```
