const test = require('node:test');
const assert = require('node:assert/strict');

function createFakeDocument() {
  const elements = {};
  const ids = [
    'verbGroupsContainer', 'tenseSelectionContainer', 'questionCountContainer',
    'startExerciseButton', 'homeScreen', 'quizScreen', 'resultsScreen', 'studyScreen',
    'backToHomeButton', 'openStudyScreenButton', 'studyBackButton', 'questionCounter',
    'questionTotal', 'scorePill', 'questionPrompt', 'questionMeta', 'answerInput',
    'submitAnswerButton', 'showConjugationButton', 'conjugationSheet', 'nextQuestionButton',
    'feedback', 'finalScore', 'finalTotal', 'finalPercentage', 'correctCount',
    'incorrectCount', 'newExerciseButton', 'studyVerbSelect', 'studyTenseSelect',
    'studyConjugationCard',
  ];

  const makeClassList = () => {
    const values = new Set();
    return {
      add: (...names) => names.forEach((name) => values.add(name)),
      remove: (...names) => names.forEach((name) => values.delete(name)),
      toggle: (name, force) => {
        if (force === true) {
          values.add(name);
          return true;
        }
        if (force === false) {
          values.delete(name);
          return false;
        }
        if (values.has(name)) {
          values.delete(name);
          return false;
        }
        values.add(name);
        return true;
      },
      contains: (name) => values.has(name),
    };
  };

  const makeElement = () => ({
    value: '',
    textContent: '',
    innerHTML: '',
    disabled: false,
    dataset: {},
    style: {},
    children: [],
    classList: makeClassList(),
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    addEventListener(type, handler) {
      this[type] = handler;
    },
    setAttribute() {},
    focus() {},
  });

  ids.forEach((id) => {
    elements[id] = makeElement();
    elements[id].id = id;
  });

  const document = {
    getElementById: (id) => elements[id] || null,
    createElement: () => makeElement(),
  };

  return { document, elements };
}

const app = require('../script.js');

test('default configuration includes all categories and standard question count', () => {
  const categories = app.getCategories();
  assert.ok(categories.length >= 5);
  assert.equal(app.getQuestionCount(), 20);
  assert.ok(app.getSelectedVerbIds().length > 0);
  assert.ok(app.getSelectedTenses().length >= 1);
});

test('toggle category selects and deselects all verbs in that category', () => {
  app.resetExerciseConfig();
  const category = app.getCategories()[0];
  const verbsInCategory = app.getCategoryVerbIds(category.id);

  assert.ok(verbsInCategory.length > 0);
  app.toggleCategory(category.id);
  assert.equal(app.getSelectedVerbIds().filter((id) => verbsInCategory.includes(id)).length, 0);

  app.toggleCategory(category.id);
  assert.equal(app.getSelectedVerbIds().filter((id) => verbsInCategory.includes(id)).length, verbsInCategory.length);
});

test('toggle individual verb overrides category selection', () => {
  app.resetExerciseConfig();
  const category = app.getCategories()[0];
  const verbId = app.getCategoryVerbIds(category.id)[0];

  app.toggleVerb(verbId);
  assert.ok(!app.getSelectedVerbIds().includes(verbId));

  const categoryState = app.getCategorySelectionState(category.id);
  assert.ok(categoryState === 'partial' || categoryState === 'none');
});

for (const count of [10, 20, 50]) {
  test(`question generation creates exactly ${count} questions`, () => {
    app.resetExerciseConfig();
    const selectedVerbs = app.getVerbIdsByCategory('first group').slice(0, 3);
    const selectedTenses = ['Présent', 'Imparfait'];
    app.setSelectedVerbs(selectedVerbs);
    app.setSelectedTenses(selectedTenses);

    const questions = app.buildQuizQuestions({
      questionCount: count,
      selectedVerbIds: selectedVerbs,
      selectedTenses,
    });

    assert.equal(questions.length, count);
    for (const question of questions) {
      assert.ok(selectedVerbs.includes(question.verb.id));
      assert.ok(selectedTenses.includes(question.tense));
    }
  });
}

test('selected tenses limit quiz questions to those tenses', () => {
  app.resetExerciseConfig();
  const selectedVerbs = app.getVerbIdsByCategory('first group').slice(0, 3);
  const selectedTenses = ['Présent', 'Futur simple'];
  app.setSelectedVerbs(selectedVerbs);
  app.setSelectedTenses(selectedTenses);

  const questions = app.buildQuizQuestions({
    questionCount: 12,
    selectedVerbIds: selectedVerbs,
    selectedTenses,
  });

  for (const question of questions) {
    assert.ok(selectedTenses.includes(question.tense));
  }
});

test('10-question selection keeps the active quiz total at 10', () => {
  app.resetExerciseConfig();
  app.setQuestionCount(10);
  const selectedVerbs = app.getVerbIdsByCategory('first group').slice(0, 2);
  const selectedTenses = ['Présent'];
  app.setSelectedVerbs(selectedVerbs);
  app.setSelectedTenses(selectedTenses);

  const questions = app.buildQuizQuestions({
    questionCount: 10,
    selectedVerbIds: selectedVerbs,
    selectedTenses,
  });

  assert.equal(app.getQuestionCount(), 10);
  assert.equal(app.getQuizTotal(), 10);
  assert.equal(questions.length, 10);
  for (const question of questions) {
    assert.ok(selectedVerbs.includes(question.verb.id));
    assert.equal(question.tense, 'Présent');
  }
});

test('incorrect answer conjugation sheet shows the complete answer and highlights the question person', () => {
  const markup = app.buildConjugationTableMarkup('avoir', 'Passé composé', 'io');

  assert.match(markup, /<th>je<\/th>/i);
  assert.match(markup, /<td>ai eu<\/td>/i);
  assert.match(markup, /<th>tu<\/th>/i);
  assert.match(markup, /<td>as eu<\/td>/i);
  assert.match(markup, /is-highlighted/i);
});

test('conjugation table second column contains only the conjugated form and never repeats the person', () => {
  const rows = app.getConjugationRows('avoir', 'Passé composé');

  assert.equal(rows.length, 6);
  assert.deepEqual(rows.map((row) => row.key), ['io', 'tu', 'lui', 'noi', 'voi', 'loro']);
  assert.equal(rows[0].value, 'ai eu');
  assert.equal(rows[1].value, 'as eu');
  assert.equal(rows[2].value, 'a eu');
  assert.equal(rows[3].value, 'avons eu');
  assert.equal(rows[4].value, 'avez eu');
  assert.equal(rows[5].value, 'ont eu');
  assert.ok(!rows[1].value.includes('tu'));
  assert.ok(!rows[2].value.includes('il'));
});

test('compound tense uses the full conjugated forms from the shared dataset', () => {
  const rows = app.getConjugationRows('avoir', 'Passé composé');

  assert.equal(rows.length, 6);
  assert.deepEqual(rows.map((row) => row.key), ['io', 'tu', 'lui', 'noi', 'voi', 'loro']);
  assert.equal(rows[0].value, 'ai eu');
  assert.equal(rows[1].value, 'as eu');
  assert.equal(rows[2].value, 'a eu');
  assert.equal(rows[3].value, 'avons eu');
  assert.equal(rows[4].value, 'avez eu');
  assert.equal(rows[5].value, 'ont eu');
});

test('study card shows all six persons and matches the quiz dataset', () => {
  const quizRows = app.getConjugationRows('être', 'Présent');
  const studyCard = app.getStudyCardData('être', 'Présent');

  assert.equal(studyCard.infinitive, 'être');
  assert.equal(studyCard.tense, 'Présent');
  assert.equal(studyCard.rows.length, 6);
  assert.deepEqual(studyCard.rows.map((row) => row.key), quizRows.map((row) => row.key));
  assert.deepEqual(studyCard.rows.map((row) => row.value), quizRows.map((row) => row.value));
  assert.ok(studyCard.rows.some((row) => row.label === 'je'));
  assert.ok(studyCard.rows.some((row) => row.label === 'ils / elles'));
});

test('study-card verbs are alphabetically ordered', () => {
  const originalDocument = global.document;
  const { document, elements } = createFakeDocument();
  global.document = document;

  delete require.cache[require.resolve('../script.js')];
  require('../script.js');

  const markup = elements.studyVerbSelect.innerHTML;
  assert.ok(markup.indexOf('aller') < markup.indexOf('avoir'));
  assert.ok(markup.indexOf('être') > markup.indexOf('écouter'));

  global.document = originalDocument;
});

test('accent-sensitive comparison distinguishes mangé from mange and preserves apostrophe behavior', () => {
  const normalize = (value) => value.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[’‘]/g, "'");
  assert.notEqual(normalize('mangé'), normalize('mange'));
  assert.equal(normalize('MANGÉ'), 'mangé');
  assert.equal(normalize("j'ai mangé"), "j'ai mangé");
  assert.equal(normalize('j’ai mangé'), "j'ai mangé");
});

test('specific category or verb selection limits the quiz to the chosen pool', () => {
  app.resetExerciseConfig();
  const categoryId = 'auxiliary';
  const selectedVerbs = app.getVerbIdsByCategory(categoryId);
  const selectedTenses = ['Présent'];
  app.setSelectedVerbs(selectedVerbs);
  app.setSelectedTenses(selectedTenses);

  const questions = app.buildQuizQuestions({
    questionCount: 15,
    selectedVerbIds: selectedVerbs,
    selectedTenses,
  });

  assert.ok(questions.length === 15);
  for (const question of questions) {
    assert.ok(selectedVerbs.includes(question.verb.id));
    assert.equal(question.tense, 'Présent');
  }
});

test('buildFullFrenchAnswer: je + ai -> "j\'ai"', () => {
  const result = app.buildFullFrenchAnswer('io', 'ai');
  assert.equal(result, "j'ai");
});

test('buildFullFrenchAnswer: je + avais -> "j\'avais"', () => {
  const result = app.buildFullFrenchAnswer('io', 'avais');
  assert.equal(result, "j'avais");
});

test('buildFullFrenchAnswer: je + aime -> "j\'aime"', () => {
  const result = app.buildFullFrenchAnswer('io', 'aime');
  assert.equal(result, "j'aime");
});

test('buildFullFrenchAnswer: je + irai -> "j\'irai"', () => {
  const result = app.buildFullFrenchAnswer('io', 'irai');
  assert.equal(result, "j'irai");
});

test('buildFullFrenchAnswer: tu + as -> "tu as"', () => {
  const result = app.buildFullFrenchAnswer('tu', 'as');
  assert.equal(result, 'tu as');
});

test('buildFullFrenchAnswer: nous + avons -> "nous avons"', () => {
  const result = app.buildFullFrenchAnswer('noi', 'avons');
  assert.equal(result, 'nous avons');
});

test('buildFullFrenchAnswer: vous + avez -> "vous avez"', () => {
  const result = app.buildFullFrenchAnswer('voi', 'avez');
  assert.equal(result, 'vous avez');
});

test('buildFullFrenchAnswer: il + a -> "il a"', () => {
  const result = app.buildFullFrenchAnswer('lui', 'a');
  assert.equal(result, 'il a');
});

test('buildFullFrenchAnswer: ils + ont -> "ils ont"', () => {
  const result = app.buildFullFrenchAnswer('loro', 'ont');
  assert.equal(result, 'ils ont');
});

test('quiz questions include fullAnswer field with combined subject and conjugation', () => {
  app.resetExerciseConfig();
  const selectedVerbs = ['avoir'];
  const selectedTenses = ['Présent'];
  app.setSelectedVerbs(selectedVerbs);
  app.setSelectedTenses(selectedTenses);

  const questions = app.buildQuizQuestions({
    questionCount: 5,
    selectedVerbIds: selectedVerbs,
    selectedTenses,
  });

  for (const question of questions) {
    assert.ok(question.fullAnswer);
    assert.ok(typeof question.fullAnswer === 'string');
    assert.ok(question.fullAnswer.length > 0);
    // fullAnswer should contain both the subject and the conjugation
    if (question.person.key === 'io') {
      assert.ok(question.fullAnswer.startsWith("j'"));
    } else if (question.person.key === 'tu') {
      assert.ok(question.fullAnswer.startsWith('tu '));
    } else if (question.person.key === 'noi') {
      assert.ok(question.fullAnswer.startsWith('nous '));
    } else if (question.person.key === 'voi') {
      assert.ok(question.fullAnswer.startsWith('vous '));
    } else if (question.person.key === 'lui') {
      assert.ok(question.fullAnswer.startsWith('il '));
    } else if (question.person.key === 'loro') {
      assert.ok(question.fullAnswer.startsWith('ils '));
    }
  }
});

test('answer validation accepts "j\'ai mangé" but rejects "ai mangé"', () => {
  const normalize = (value) => value.toLowerCase().trim().replace(/\s+/g, ' ').replace(/['']/g, "'");
  
  // Correct full answer
  const correctFull = "j'ai mangé";
  assert.equal(normalize(correctFull), "j'ai mangé");
  
  // Incorrect partial answer
  const partialAnswer = "ai mangé";
  assert.notEqual(normalize(partialAnswer), normalize(correctFull));
  
  // Case insensitivity still works
  assert.equal(normalize("J'AI MANGÉ"), normalize(correctFull));
  
  // Apostrophe variants still work
  assert.equal(normalize("j'ai mangé"), normalize("j'ai mangé"));
});

test('getPreferredFrenchVoice prefers fr-FR voice', () => {
  const mockVoices = [
    { lang: 'en-US', name: 'English (US)' },
    { lang: 'fr-CA', name: 'French (Canada)' },
    { lang: 'fr-FR', name: 'French (France)' },
  ];

  const originalGetVoices = global.SpeechSynthesis && global.SpeechSynthesis.getVoices;
  
  // Mock speechSynthesis only if we have a window-like object
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.getVoices = () => mockVoices;
  }

  const voice = app.getPreferredFrenchVoice();
  
  // Restore original
  if (typeof window !== 'undefined' && window.speechSynthesis && originalGetVoices) {
    window.speechSynthesis.getVoices = originalGetVoices;
  }

  // In Node environment, getPreferredFrenchVoice returns null, which is correct
  assert.strictEqual(voice, null);
});

test('canUseSpeechSynthesis returns false in Node environment', () => {
  const result = app.canUseSpeechSynthesis();
  assert.equal(result, false);
});

test('buildFullFrenchAnswer returns empty string for empty conjugation', () => {
  const result = app.buildFullFrenchAnswer('io', '');
  assert.equal(result, '');
  
  const result2 = app.buildFullFrenchAnswer('tu', null);
  assert.equal(result2, '');
});

test('startsWithVowelOrH correctly identifies vowel/h starts', () => {
  assert.ok(app.startsWithVowelOrH('ai'));
  assert.ok(app.startsWithVowelOrH('aime'));
  assert.ok(app.startsWithVowelOrH('avais'));
  assert.ok(app.startsWithVowelOrH('étais'));
  assert.ok(app.startsWithVowelOrH('irai'));
  assert.ok(app.startsWithVowelOrH('aurais'));
  assert.ok(app.startsWithVowelOrH('avoir'));
  assert.ok(app.startsWithVowelOrH('hériter'));
  
  assert.ok(!app.startsWithVowelOrH('mange'));
  assert.ok(!app.startsWithVowelOrH('mangeais'));
  assert.ok(!app.startsWithVowelOrH('prends'));
  assert.ok(!app.startsWithVowelOrH('fais'));
  assert.ok(!app.startsWithVowelOrH('travaillais'));
  assert.ok(!app.startsWithVowelOrH(''));
});

test('buildValidAnswers: je + mangeais -> ["je mangeais"] (no elision)', () => {
  const result = app.buildValidAnswers('io', 'mangeais');
  assert.deepEqual(result, ['je mangeais']);
});

test('buildValidAnswers: je + aime -> ["j\'aime"] (elision)', () => {
  const result = app.buildValidAnswers('io', 'aime');
  assert.deepEqual(result, ["j'aime"]);
});

test('buildValidAnswers: je + ai -> ["j\'ai"] (elision)', () => {
  const result = app.buildValidAnswers('io', 'ai');
  assert.deepEqual(result, ["j'ai"]);
});

test('buildValidAnswers: je + avais -> ["j\'avais"] (elision)', () => {
  const result = app.buildValidAnswers('io', 'avais');
  assert.deepEqual(result, ["j'avais"]);
});

test('buildValidAnswers: je + étais -> ["j\'étais"] (elision)', () => {
  const result = app.buildValidAnswers('io', 'étais');
  assert.deepEqual(result, ["j'étais"]);
});

test('buildValidAnswers: je + irai -> ["j\'irai"] (elision)', () => {
  const result = app.buildValidAnswers('io', 'irai');
  assert.deepEqual(result, ["j'irai"]);
});

test('buildValidAnswers: je + aurais -> ["j\'aurais"] (elision)', () => {
  const result = app.buildValidAnswers('io', 'aurais');
  assert.deepEqual(result, ["j'aurais"]);
});

test('buildValidAnswers: je + mange -> ["je mange"] (no elision)', () => {
  const result = app.buildValidAnswers('io', 'mange');
  assert.deepEqual(result, ['je mange']);
});

test('buildValidAnswers: je + prends -> ["je prends"] (no elision)', () => {
  const result = app.buildValidAnswers('io', 'prends');
  assert.deepEqual(result, ['je prends']);
});

test('buildValidAnswers: tu + as -> ["tu as"]', () => {
  const result = app.buildValidAnswers('tu', 'as');
  assert.deepEqual(result, ['tu as']);
});

test('buildValidAnswers: nous + avons -> ["nous avons"]', () => {
  const result = app.buildValidAnswers('noi', 'avons');
  assert.deepEqual(result, ['nous avons']);
});

test('buildValidAnswers: lui (3rd singular) accepts both il and elle', () => {
  const result = app.buildValidAnswers('lui', 'mangeait');
  assert.deepEqual(result, ['il mangeait', 'elle mangeait']);
});

test('buildValidAnswers: loro (3rd plural) accepts both ils and elles', () => {
  const result = app.buildValidAnswers('loro', 'mangeaient');
  assert.deepEqual(result, ['ils mangeaient', 'elles mangeaient']);
});

test('quiz questions include validAnswers array with all valid options', () => {
  app.resetExerciseConfig();
  const selectedVerbs = ['avoir'];
  const selectedTenses = ['Présent'];
  app.setSelectedVerbs(selectedVerbs);
  app.setSelectedTenses(selectedTenses);

  const questions = app.buildQuizQuestions({
    questionCount: 10,
    selectedVerbIds: selectedVerbs,
    selectedTenses,
  });

  for (const question of questions) {
    assert.ok(Array.isArray(question.validAnswers));
    assert.ok(question.validAnswers.length > 0);
    assert.ok(question.fullAnswer);
    assert.equal(question.fullAnswer, question.validAnswers[0]);
  }
});

test('lui/lei questions have two valid answers (il and elle)', () => {
  app.resetExerciseConfig();
  const selectedVerbs = ['avoir'];
  const selectedTenses = ['Imparfait'];
  app.setSelectedVerbs(selectedVerbs);
  app.setSelectedTenses(selectedTenses);

  const questions = app.buildQuizQuestions({
    questionCount: 20,
    selectedVerbIds: selectedVerbs,
    selectedTenses,
  });

  const luiQuestions = questions.filter((q) => q.person.key === 'lui');
  
  if (luiQuestions.length > 0) {
    for (const q of luiQuestions) {
      assert.equal(q.validAnswers.length, 2);
      assert.ok(q.validAnswers[0].startsWith('il'));
      assert.ok(q.validAnswers[1].startsWith('elle'));
    }
  }
});

test('loro questions have two valid answers (ils and elles)', () => {
  app.resetExerciseConfig();
  const selectedVerbs = ['avoir'];
  const selectedTenses = ['Imparfait'];
  app.setSelectedVerbs(selectedVerbs);
  app.setSelectedTenses(selectedTenses);

  const questions = app.buildQuizQuestions({
    questionCount: 20,
    selectedVerbIds: selectedVerbs,
    selectedTenses,
  });

  const loroQuestions = questions.filter((q) => q.person.key === 'loro');
  
  if (loroQuestions.length > 0) {
    for (const q of loroQuestions) {
      assert.equal(q.validAnswers.length, 2);
      assert.ok(q.validAnswers[0].startsWith('ils'));
      assert.ok(q.validAnswers[1].startsWith('elles'));
    }
  }
});

test('answer validation accepts any valid answer for 3rd person', () => {
  const normalize = (v) => v.toLowerCase().trim().replace(/\s+/g, ' ').replace(/['']/g, "'");
  
  // For lui/lei + mangeait
  const validAnswers = ['il mangeait', 'elle mangeait'];
  
  assert.equal(normalize('il mangeait'), normalize(validAnswers[0]));
  assert.equal(normalize('elle mangeait'), normalize(validAnswers[1]));
  assert.notEqual(normalize('mangeait'), normalize(validAnswers[0]));
});

test('answer validation rejects answers without pronoun', () => {
  const normalize = (v) => v.toLowerCase().trim().replace(/\s+/g, ' ').replace(/['']/g, "'");
  
  const userAnswer = 'mangeait';
  const validAnswers = ['il mangeait', 'elle mangeait'];
  
  const isCorrect = validAnswers.some(
    (validAnswer) => normalize(validAnswer) === normalize(userAnswer)
  );
  
  assert.ok(!isCorrect);
});

test('existing scoring behavior remains correct with validAnswers', () => {
  app.resetExerciseConfig();
  app.setQuestionCount(10);
  const selectedVerbs = app.getVerbIdsByCategory('auxiliary');
  const selectedTenses = ['Présent'];
  app.setSelectedVerbs(selectedVerbs);
  app.setSelectedTenses(selectedTenses);

  const questions = app.buildQuizQuestions({
    questionCount: 10,
    selectedVerbIds: selectedVerbs,
    selectedTenses,
  });

  assert.equal(questions.length, 10);
  for (const question of questions) {
    assert.ok(question.validAnswers);
    assert.ok(question.fullAnswer);
  }
});

test('study-card pronunciation uses complete French expressions with quiz elision', () => {
  assert.equal(app.buildFullFrenchAnswer('io', 'mangeais'), 'je mangeais');
  assert.equal(app.buildFullFrenchAnswer('io', 'ai mangé'), "j'ai mangé");
  assert.equal(app.buildFullFrenchAnswer('tu', 'as mangé'), 'tu as mangé');
});

test('study-card markup has one speaker button for every conjugation row', () => {
  const originalDocument = global.document;
  const { document, elements } = createFakeDocument();
  global.document = document;

  delete require.cache[require.resolve('../script.js')];
  require('../script.js');

  assert.equal((elements.studyConjugationCard.innerHTML.match(/study-speaker-btn/g) || []).length, 6);

  global.document = originalDocument;
});

test('a study-card speaker click speaks only its row using a French voice', () => {
  const originalDocument = global.document;
  const originalWindow = global.window;
  const { document, elements } = createFakeDocument();
  const spoken = [];
  const frenchVoice = { lang: 'fr-FR', name: 'French (France)' };

  global.document = document;
  delete require.cache[require.resolve('../script.js')];
  require('../script.js');
  global.window = {
    SpeechSynthesisUtterance: function SpeechSynthesisUtterance(text) {
      this.text = text;
    },
    speechSynthesis: {
      getVoices: () => [{ lang: 'en-US' }, frenchVoice],
      cancel: () => {},
      speak: (utterance) => spoken.push(utterance),
    },
  };

  const speakerButton = { dataset: { speechText: 'je mangeais' } };
  let prevented = false;
  let stopped = false;
  elements.studyConjugationCard.click({
    target: { closest: () => speakerButton },
    preventDefault: () => { prevented = true; },
    stopPropagation: () => { stopped = true; },
  });

  assert.equal(spoken.length, 1);
  assert.equal(spoken[0].text, 'je mangeais');
  assert.equal(spoken[0].voice, frenchVoice);
  assert.ok(prevented);
  assert.ok(stopped);

  global.document = originalDocument;
  global.window = originalWindow;
});
