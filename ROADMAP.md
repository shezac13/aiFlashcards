# AI Flashcards Roadmap

Implementation backlog for turning the current sample plugin into an Obsidian flashcard plugin.

## Epic 0: Foundation

### Issue 1: Strip out the sample plugin code
Remove the ribbon action, sample modal, demo commands, status bar text, and template settings so the plugin starts from a clean base.

Done when:
- `src/main.ts` only contains plugin lifecycle code.
- Placeholder UI and sample commands are gone.
- Plugin metadata matches the flashcard plugin.

### Issue 2: Define the settings model
Add the persistent settings the rest of the plugin will rely on.

Required settings:
- AI provider name
- Provider mode (cloud or local)
- API key or auth token
- Model name
- Local endpoint or model path
- Source folder list
- Include subfolders toggle
- Exclude rules
- Card generation limits
- Study session behavior

Done when:
- Settings are typed in one place.
- Defaults exist for every setting.
- Settings are saved and loaded through Obsidian storage.

## Epic 1: Source Collection

### Issue 3: Add folder selection
Let the user choose which vault folders feed flashcard generation.

Done when:
- User can configure one or more folders.
- Subfolder behavior is configurable.
- Notes outside the selected scope are ignored.

### Issue 4: Extract note content
Build the pipeline that reads note sources and turns them into prompt input.

Done when:
- Markdown files are scanned from the selected folders.
- PDF files are handled through text extraction or OCR fallback.
- Screenshots and images (`png` / `jpg`) are handled through OCR.
- Frontmatter, headings, and body text are handled consistently.
- Large notes are chunked or trimmed predictably.

### Issue 5: Add note filters
Support the filters needed to keep bad input out of generation.

Possible filters:
- Tags
- Frontmatter fields
- Filename patterns
- Excluded folders
- Exact files

Done when:
- Filter rules are applied before generation.
- The user can narrow generation to exact files when needed.
- Filter behavior is documented in settings.

## Epic 2: AI Generation

### Issue 6: Add AI provider integration
Implement the client that sends note content to the selected AI provider.

Done when:
- Requests include the configured model and credentials.
- Local mode works through a settings-backed endpoint or local model path.
- Errors are surfaced clearly to the user.
- Network failures do not crash the plugin.

### Issue 7: Define the flashcard response schema
Make the model return structured flashcard data.

Schema should include:
- Question
- Correct answer
- Distractors
- Source note reference
- Explanation for the correct answer

Done when:
- Responses are parsed into typed flashcard objects.
- Invalid responses are rejected or repaired.
- Each multiple-choice card has exactly one correct option.
- Each card has four answer options.

### Issue 8: Build prompt templates
Write prompts that produce short, usable cards from note content.

Done when:
- Prompt style is configurable.
- Output is optimized for multiple-choice quizzes.
- The prompt encourages grounded answers from the selected notes.

### Issue 9: Validate generated cards
Add a cleanup step before cards reach the review UI.

Done when:
- Duplicate cards are removed.
- Distractors are unique and plausible.
- Malformed cards are skipped with a user-visible warning.

## Epic 3: Review Experience

### Issue 10: Build the review UI
Create the view where users answer the multiple-choice questions.

Done when:
- One question is shown at a time.
- Each question shows four answer options.
- Multiple-choice answers are displayed clearly.
- The UI reveals correctness after selection.
- If the user selects the wrong option, the selected answer is shown in red and the correct answer is shown in green.
- If the user selects the correct option, it is highlighted in green.
- The explanation is shown after the answer is revealed.

### Issue 11: Track session state
Keep the current review session state in one place.

Done when:
- Current card index is tracked.
- Correct and incorrect counts are tracked.
- Skip and retry behavior is defined.

### Issue 12: Add session completion
Show the user the end-of-session summary and let them restart.

Done when:
- A summary is shown when the deck is finished.
- Users can restart or regenerate cards.
- Session metrics are easy to understand.

## Epic 4: Commands and Entry Points

### Issue 13: Add generation commands
Add command palette entries for generating flashcards and starting a review session.

Done when:
- A command exists to generate cards.
- A command exists to open the review session.
- Commands are stable and clearly named.

### Issue 14: Add a launch path
Choose the entry point for the workflow, whether that ends up being the ribbon, command palette, or a dedicated view.

Done when:
- The launch path is obvious.
- It works consistently after reloads.
- It does not depend on the sample template UI.

## Epic 5: Persistence and Quality

### Issue 15: Persist decks or session history
Store generated cards if they need to survive between sessions.

Done when:
- Decks survive app restarts if enabled.
- Storage is scoped and predictable.
- Old decks can be regenerated or deleted.

### Issue 16: Add privacy handling
Make the AI data flow explicit so the user knows what gets sent out.

Done when:
- The user explicitly configures the provider.
- Privacy implications are documented.
- No hidden network activity occurs.

### Issue 17: Add validation and tests
Cover the selection, generation, parsing, and review path with tests or checks.

Done when:
- Folder filtering is tested.
- AI response parsing is tested.
- The review flow has at least basic validation.

## Suggested Build Order

1. Foundation
2. Source collection
3. AI generation
4. Review experience
5. Commands and entry points
6. Persistence and quality
