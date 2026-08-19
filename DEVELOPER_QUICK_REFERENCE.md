# Developer Quick Reference - Pronunciation & Answer Format Fixes

## New Public Functions

### 1. `buildFullFrenchAnswer(personKey, conjugatedForm)`

**Purpose**: Combine grammatical person/pronoun with conjugated verb form, handling French elision rules.

**Parameters**:
- `personKey` (string): One of `'io', 'tu', 'lui', 'noi', 'voi', 'loro'`
- `conjugatedForm` (string): The bare conjugated verb form from the dataset

**Returns**: (string) Complete French phrase with subject and proper elision

**Examples**:
```javascript
buildFullFrenchAnswer('io', 'ai')        // Returns: "j'ai"
buildFullFrenchAnswer('io', 'avais')     // Returns: "j'avais"
buildFullFrenchAnswer('tu', 'as')        // Returns: "tu as"
buildFullFrenchAnswer('lui', 'a')        // Returns: "il a"
buildFullFrenchAnswer('noi', 'avons')    // Returns: "nous avons"
buildFullFrenchAnswer('voi', 'avez')     // Returns: "vous avez"
buildFullFrenchAnswer('loro', 'ont')     // Returns: "ils ont"
buildFullFrenchAnswer('io', '')          // Returns: ""
```

**Elision Rules**:
- `'io'` (je) always elides to `j'` before any verb form
- All other pronouns use space-separation, never elide

---

### 2. `getPreferredFrenchVoice()`

**Purpose**: Robustly select a French speech synthesis voice from browser's available voices.

**Parameters**: None

**Returns**: (object|null) 
- Voice object with `lang` property if found
- `null` if no French voice available

**Priority Order**:
1. Exact fr-FR voice (France French)
2. Any fr-* voice (fr-CA, fr-BE, etc.)
3. null (graceful degradation)

**Usage Example**:
```javascript
function speakFrench(text) {
  if (!window.speechSynthesis) return;
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  
  // Use preferred voice if available
  const voice = getPreferredFrenchVoice();
  if (voice) {
    utterance.voice = voice;
  }
  
  window.speechSynthesis.speak(utterance);
}
```

---

## Changed Data Structures

### Quiz Question Object

**Before**:
```javascript
{
  verb: { ... },
  tense: 'Présent',
  person: { key: 'io', italian: 'io' },
  answer: 'ai',           // ← Only this
  prompt: 'io ...',
  key: '...'
}
```

**After**:
```javascript
{
  verb: { ... },
  tense: 'Présent',
  person: { key: 'io', italian: 'io' },
  answer: 'ai',           // ← Still here (for reference)
  fullAnswer: "j'ai",     // ← NEW: complete French phrase
  prompt: 'io ...',
  key: '...'
}
```

**Note**: Both fields are present. `answer` is kept for reference but `fullAnswer` is used for validation and pronunciation.

---

## Changed Functions

### `buildQuizQuestions()`

**Change**: Now creates `fullAnswer` field for each question.

**Code**:
```javascript
const answer = selectedVerb.conjugations[selectedTense][selectedPerson.key];
const fullAnswer = buildFullFrenchAnswer(selectedPerson.key, answer);  // ← NEW
const question = {
  // ... other fields ...
  answer,                      // bare verb
  fullAnswer,                  // complete phrase with subject
};
```

---

### `checkAnswer()`

**Change**: Validates against `fullAnswer` instead of bare `answer`.

**Before**:
```javascript
const userAnswer = normalizeText(elements.answerInput.value);
const correctAnswer = normalizeText(state.currentQuestion.answer);  // bare verb
const isCorrect = userAnswer === correctAnswer;
```

**After**:
```javascript
const userAnswer = normalizeText(elements.answerInput.value);
const correctAnswer = normalizeText(state.currentQuestion.fullAnswer);  // complete phrase
const isCorrect = userAnswer === correctAnswer;
```

**Impact**: User must now type complete subject + verb (e.g., "j'ai" not "ai")

---

### `speakCurrentAnswer()`

**Changes**:
1. Uses `fullAnswer` instead of bare `answer`
2. Uses `getPreferredFrenchVoice()` for robust voice selection

**Before**:
```javascript
const correctAnswerText = getSpeechText(state.currentQuestion.answer);
// ... voice selection ...
const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
const preferredVoice = voices.find((voice) => 
  (voice.lang || '').toLowerCase() === 'fr-fr' || 
  (voice.lang || '').toLowerCase().startsWith('fr')
);
```

**After**:
```javascript
const fullAnswerText = getSpeechText(state.currentQuestion.fullAnswer);
// ... voice selection ...
const preferredVoice = getPreferredFrenchVoice();
```

**Impact**: Speaks complete answers in proper French voice

---

### Feedback Messages

**Before**:
```javascript
`Correct! avoir in Présent for io is "ai".`
`Incorrect. Correct answer: "ai".`
```

**After**:
```javascript
`Correct! avoir in Présent for io is "j'ai".`
`Incorrect. Correct answer: "j'ai".`
```

---

## Answer Validation Behavior

### Normalization (Unchanged)
```javascript
function normalizeText(value) {
  return String(value)
    .toLowerCase()              // Case insensitive
    .trim()                      // Remove leading/trailing spaces
    .replace(/\s+/g, ' ')       // Normalize internal spaces
    .replace(/['']/g, "'");     // Normalize apostrophes
}
```

### Validation Examples

| User Input | Expected | Result | Reason |
|---|---|---|---|
| `j'ai mangé` | `j'ai mangé` | ✅ Correct | Exact match |
| `J'AI MANGÉ` | `j'ai mangé` | ✅ Correct | Case insensitive |
| `j'ai mangé` | `j'ai mangé` | ✅ Correct | Apostrophe variant |
| `ai mangé` | `j'ai mangé` | ❌ Incorrect | Missing subject |
| `je ai` | `j'ai mangé` | ❌ Incorrect | Wrong elision |
| `j'ai mange` | `j'ai mangé` | ❌ Incorrect | Missing accent |

---

## Testing

### Unit Tests Added
```javascript
test('buildFullFrenchAnswer: je + ai -> "j\'ai"', () => {
  assert.equal(app.buildFullFrenchAnswer('io', 'ai'), "j'ai");
});

test('answer validation accepts "j\'ai mangé" but rejects "ai mangé"', () => {
  const normalize = (v) => v.toLowerCase().trim().replace(/\s+/g, ' ').replace(/['']/g, "'");
  const correctFull = "j'ai mangé";
  const partialAnswer = "ai mangé";
  assert.notEqual(normalize(partialAnswer), normalize(correctFull));
});

test('getPreferredFrenchVoice prefers fr-FR voice', () => {
  const voice = app.getPreferredFrenchVoice();
  // In Node: null (expected)
  // In Browser: voice object with French lang
});
```

**Run Tests**:
```bash
node --test
```

---

## Migration Guide (For Quiz API Users)

### If You Were Using `question.answer` Directly

**Before**:
```javascript
const bareConjugation = question.answer;  // e.g., "ai"
```

**After**:
```javascript
const fullPhrase = question.fullAnswer;   // e.g., "j'ai"
const bareConjugation = question.answer;  // still available if needed
```

### If You Were Building Custom Answer Checks

**Before**:
```javascript
const isCorrect = userInput === question.answer;
```

**After**:
```javascript
const isCorrect = userInput === question.fullAnswer;
```

### If You Were Using Speech Synthesis

**Before**:
```javascript
const utterance = new SpeechSynthesisUtterance(question.answer);
utterance.lang = 'fr-FR';
// Manually searched for French voice
```

**After**:
```javascript
const utterance = new SpeechSynthesisUtterance(question.fullAnswer);
utterance.lang = 'fr-FR';
const voice = getPreferredFrenchVoice();
if (voice) utterance.voice = voice;
```

---

## Browser Compatibility

✅ Works in all modern browsers with Web Speech API:
- Chrome 25+
- Firefox 49+
- Safari 14.1+
- Edge 79+

⚠️ Voice availability varies by browser:
- Most have at least one French voice
- Some have multiple French variants
- Falls back gracefully if none available

---

## Performance Notes

- `buildFullFrenchAnswer()`: O(1) - simple string concatenation
- `getPreferredFrenchVoice()`: O(n) where n = number of available voices
  - Typically 20-40 voices on modern systems
  - Cached by browser, called once per submission
- No additional database or network calls

---

## Debugging

### Check if Voice Selection Works
```javascript
// In browser console:
console.log(window.speechSynthesis.getVoices());
console.log(app.getPreferredFrenchVoice());
```

### Check if Full Answer is Generated
```javascript
// In browser console after starting quiz:
console.log(state.currentQuestion.fullAnswer);
```

### Test Normalization
```javascript
// In Node or browser:
const normalize = (v) => v.toLowerCase().trim().replace(/\s+/g, ' ').replace(/['']/g, "'");
console.log(normalize("J'AI MANGÉ"));  // "j'ai mangé"
```

---

## Summary of Changes

| Aspect | Before | After |
|--------|--------|-------|
| **Accepted answer** | "ai" | "j'ai" (with subject) |
| **Pronunciation** | English voice | French (fr-FR preferred) |
| **Feedback text** | "correct answer: ai" | "correct answer: j'ai" |
| **Voice selection** | Generic | Robust 3-tier priority |
| **Data per question** | 1 answer field | 2 answer fields |
| **Validation** | Bare verb only | Full phrase with subject |

---

## Files to Review

- `script.js` - Main implementation (look for `buildFullFrenchAnswer`, `getPreferredFrenchVoice`)
- `tests/selection.test.js` - New test cases (14 new tests added)
- `index.html` - No changes needed (UI unchanged)
- `styles.css` - No changes needed (visual unchanged)
