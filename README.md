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

How to access the demo (Live)

The app is deployed to Vercel and available at the live demo:

https://c-programming-tutor.vercel.app/

No local setup is required — visit the live URL in a modern browser to try the app. If you prefer to run locally (for development or to avoid iframe restrictions), you can still serve the files with a static server (optional):

```bash
# Python 3 (optional local server for development)
python3 -m http.server 8000
# then open the served site in your browser (replace with your preferred tool)
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
