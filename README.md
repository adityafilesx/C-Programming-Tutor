# C-Tutor Pro

`C-Tutor Pro` is a browser-based learning and interview-prep app for C programming.

It includes:
- topic-wise C theory
# C-Tutor Pro

C-Tutor Pro is a lightweight, browser-based learning and interview-prep app for C programming. It's designed for quick setup (no build tools) and focuses on teaching core C concepts through theory, worked examples, an interactive memory simulator, and a live embedded compiler.

Quick highlights
- Topic-wise C theory and concise notes
- 70 worked examples (annotated code + explanations)
- Memory simulator that visualizes variables, addresses, and pointers
- Embedded live compiler (OnlineGDB) with fallback link
- LeetCode-style problem bank + interview mode with timer
- Progress tracking in browser `localStorage`

Screenshots / Visuals
> Replace these placeholders with actual screenshots when available.

![App - Topics view](docs/screenshots/topics.png)
*Topics list and progress bar*

![Memory Simulator](docs/screenshots/memory-simulator.png)
*Memory simulator showing stack layout and pointer values*

![Live Compiler](docs/screenshots/compiler.png)
*Embedded OnlineGDB compiler*

Project structure

``text
.
|- index.html        # Single-page app
|- style.css         # Styles and UI layout
`- script.js         # App logic (topics, examples, memory simulator, compiler embed)
``

How to run (Installation)

No build step is required — C-Tutor Pro runs in any modern browser.

1. Clone the repository:

```bash
git clone https://github.com/adityafilesx/C-Programming-Tutor.git
cd C-Programming-Tutor
```

2. Open the app:

```bash
# macOS / Linux
open index.html

# Windows (PowerShell)
start index.html
```

3. Use the sidebar to navigate topics, open the memory simulator, or launch the embedded compiler.

Optional: Serve locally with a simple static server (recommended if your browser blocks local iframe embeds):

```bash
# Python 3
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Features (expanded)

- Topics: chapter-style notes with short explanations and small code examples
- Worked examples: each example includes the problem statement, full C source, output, and an explanation of behavior and edge-cases
- Problem bank: tag-filtered problems (Basic / Intermediate / Interview Level) and inline hints
- Memory simulator: visualize variables, pointers, and addresses; supports basic types and pointer syntax
- Live compiler: embedded OnlineGDB iframe with fallback to open in a new tab
- Interview Mode: timed sessions, progress locking, and a focused UI
- Progress saved to `localStorage` under the key `ctutorpro_state_v3`

C topics covered (detailed)

1. Introduction
   - History and purpose of C
   - Structure of a C program (headers, main, return)
2. Data Types
   - Primitive types: int, char, short, long, float, double
   - Signed vs unsigned
   - Type sizes and sizeof
   - Type casting and promotion rules
3. Control Flow
   - if / else if / else
   - switch / case / default
   - conditional (?:) operator
4. Loops
   - for, while, do-while
   - loop control statements: break, continue
5. Arrays
   - Single-dimensional arrays
   - Multidimensional arrays
   - Array decay to pointers
   - Passing arrays to functions
6. Strings
   - C-style strings (null-terminated)
   - Common library functions: strlen, strcpy, strcmp, strcat
   - Buffer overflows and safe handling
7. Pointers
   - Pointer basics and indirection
   - Pointers and arrays relationship
   - Pointer arithmetic
   - Pointers to functions
   - Dynamic memory (malloc, free) — basic usage and pitfalls

Topics include 10 solved examples each (roughly) covering typical patterns and interview-style problems.

Persistence & state

The app stores user progress and settings in browser `localStorage` using the key `ctutorpro_state_v3`. Values saved include theme, completed topics, solved examples, memory simulator entries, and interview-mode state.

Contributing

- Add screenshots to `docs/screenshots/` and update paths above
- Open issues for new examples or topics
- Pull requests: follow small, focused changes and include a brief description

License

Add your preferred license file (e.g., `LICENSE`) to make the repo ready for public use.

Tech

- HTML5
- CSS3
- Vanilla JavaScript (no framework)

Contact / Author

adityafilesx (GitHub)
