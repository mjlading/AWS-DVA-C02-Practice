(() => {
  "use strict";

  const STORAGE_KEY = "dva-c02-practice-lab-v1";
  const THEME_KEY = "dva-c02-theme";
  const EXAM_SECONDS = 130 * 60;
  const DOMAIN_WEIGHTS = {
    "Development with AWS Services": 32,
    Security: 26,
    Deployment: 24,
    "Troubleshooting and Optimization": 18
  };

  const BANKS = {
    warmup: {
      label: "Warmup",
      questions: Array.isArray(window.QUESTIONS) ? window.QUESTIONS : []
    },
    exam: {
      label: "The real deal",
      questions: Array.isArray(window.EXAM_QUESTIONS) ? window.EXAM_QUESTIONS : []
    }
  };
  let questions = BANKS.exam.questions;
  let timerHandle = null;
  let toastHandle = null;
  let themePreference = null;
  let state = createEmptyState();
  let activeReviewFilter = "all";

  const elements = {};

  function createEmptyState() {
    return {
      version: 1,
      bank: "exam",
      mode: "timed",
      domain: "all",
      questionIds: [],
      currentIndex: 0,
      answers: {},
      marked: {},
      confidence: {},
      checked: {},
      startedAt: null,
      endsAt: null,
      completedAt: null,
      submitted: false
    };
  }

  function cacheElements() {
    [
      "landing-view",
      "exam-view",
      "results-view",
      "brand-home",
      "theme-toggle",
      "domain-picker",
      "domain-select",
      "resume-card",
      "resume-title",
      "resume-details",
      "resume-attempt",
      "discard-attempt",
      "start-summary",
      "start-description",
      "start-exam",
      "mode-pill",
      "exam-domain-label",
      "answered-summary",
      "progress-fill",
      "timer",
      "timer-value",
      "submit-exam",
      "question-grid",
      "question-domain",
      "question-position",
      "question-heading",
      "selection-instruction",
      "answer-options",
      "feedback-panel",
      "feedback-icon",
      "feedback-title",
      "feedback-explanation",
      "feedback-reference",
      "mark-review",
      "confidence",
      "previous-question",
      "check-answer",
      "next-question",
      "toggle-navigator",
      "results-title",
      "results-message",
      "score-ring",
      "score-percent",
      "readiness-banner",
      "readiness-title",
      "readiness-copy",
      "correct-count",
      "incorrect-count",
      "unanswered-count",
      "time-used",
      "domain-breakdown",
      "confidence-copy",
      "new-attempt",
      "review-answers",
      "review-section",
      "review-list",
      "submit-dialog",
      "submit-dialog-copy",
      "toast"
    ].forEach((id) => {
      elements[id] = document.getElementById(id);
    });
  }

  function init() {
    cacheElements();
    bindEvents();
    initThemeControl();
    updateModeSelection();

    const saved = readSavedState();
    if (saved) {
      state = saved;
      setActiveBank(state.bank);
      if (state.submitted) {
        renderResults();
      } else {
        updateResumeCard(saved);
      }
    }

    const incomplete = Object.values(BANKS).find((bank) => bank.questions.length !== 65);
    if (incomplete) {
      showToast(`${incomplete.label} bank is incomplete: ${incomplete.questions.length} of 65 questions available.`);
      elements["start-exam"].disabled = true;
    }
  }

  function selectedTier() {
    return document.querySelector('input[name="tier"]:checked')?.value || "exam";
  }

  function setActiveBank(tier) {
    const bank = BANKS[tier] ? tier : "warmup";
    questions = BANKS[bank].questions;
    return bank;
  }

  function bindEvents() {
    document.querySelectorAll('input[name="mode"], input[name="tier"]').forEach((input) => {
      input.addEventListener("change", updateModeSelection);
    });

    elements["theme-toggle"].addEventListener("click", toggleTheme);
    elements["domain-select"].addEventListener("change", updateStartSummary);
    elements["start-exam"].addEventListener("click", startNewAttempt);
    elements["resume-attempt"].addEventListener("click", resumeAttempt);
    elements["discard-attempt"].addEventListener("click", discardSavedAttempt);
    elements["brand-home"].addEventListener("click", returnHome);
    elements["submit-exam"].addEventListener("click", openSubmitDialog);
    elements["previous-question"].addEventListener("click", () => moveQuestion(-1));
    elements["next-question"].addEventListener("click", handleNextQuestion);
    elements["check-answer"].addEventListener("click", checkCurrentAnswer);
    elements["mark-review"].addEventListener("change", updateMarkedState);
    elements.confidence.addEventListener("change", updateConfidenceState);
    elements["toggle-navigator"].addEventListener("click", toggleNavigator);
    elements["new-attempt"].addEventListener("click", resetAttempt);
    elements["review-answers"].addEventListener("click", showReview);

    elements["submit-dialog"].addEventListener("close", () => {
      if (elements["submit-dialog"].returnValue === "confirm") {
        finalizeAttempt(false);
      }
    });

    document.querySelectorAll(".review-filters button").forEach((button) => {
      button.addEventListener("click", () => {
        activeReviewFilter = button.dataset.filter;
        document.querySelectorAll(".review-filters button").forEach((candidate) => {
          candidate.classList.toggle("is-active", candidate === button);
        });
        renderReviewList();
      });
    });

    document.addEventListener("keydown", handleKeyboardNavigation);
  }

  function initThemeControl() {
    themePreference = readThemePreference();
    applyTheme(themePreference);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (themePreference === null) {
        applyTheme(null);
      }
    });
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme;
    themePreference = currentTheme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, themePreference);
    } catch {
      showToast("The theme preference could not be saved in this browser.");
    }
    applyTheme(themePreference);
    showToast(`Theme: ${themeLabel(themePreference)}`);
  }

  function readThemePreference() {
    try {
      const preference = localStorage.getItem(THEME_KEY);
      return ["light", "dark"].includes(preference) ? preference : null;
    } catch {
      return null;
    }
  }

  function applyTheme(preference) {
    const dark = preference ? preference === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = dark ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const next = dark ? "light" : "dark";
    const label = `Switch to ${themeLabel(next)} theme. Current theme: ${themeLabel(theme)}.`;
    elements["theme-toggle"].setAttribute("aria-label", label);
    elements["theme-toggle"].title = label;
  }

  function themeLabel(preference) {
    return preference.charAt(0).toUpperCase() + preference.slice(1);
  }

  function updateModeSelection() {
    const selected = document.querySelector('input[name="mode"]:checked')?.value || "timed";
    document.querySelectorAll(".mode-card").forEach((card) => {
      card.classList.toggle("is-selected", card.querySelector("input").checked);
    });
    elements["domain-picker"].classList.toggle("is-hidden", selected !== "practice");
    updateStartSummary();
  }

  function updateStartSummary() {
    const selected = document.querySelector('input[name="mode"]:checked')?.value || "timed";
    const domain = elements["domain-select"].value;
    const bank = BANKS[selectedTier()];

    if (selected === "timed") {
      elements["start-summary"].textContent = `${bank.label}: full diagnostic exam`;
      elements["start-description"].textContent = "Explanations remain hidden until you submit.";
      elements["start-exam"].firstChild.textContent = "Start timed exam ";
      return;
    }

    const count = domain === "all"
      ? bank.questions.length
      : bank.questions.filter((question) => question.domain === domain).length;
    elements["start-summary"].textContent = `${bank.label}: ${domain === "all" ? "all-domain learning session" : domain}`;
    elements["start-description"].textContent = `${count} questions with immediate answer explanations.`;
    elements["start-exam"].firstChild.textContent = "Start learning mode ";
  }

  function startNewAttempt() {
    const bank = setActiveBank(selectedTier());
    if (questions.length !== 65) {
      showToast("The complete question bank is not available yet.");
      return;
    }

    const mode = document.querySelector('input[name="mode"]:checked')?.value || "timed";
    const domain = mode === "practice" ? elements["domain-select"].value : "all";
    const selectedQuestions = domain === "all"
      ? [...questions]
      : questions.filter((question) => question.domain === domain);

    state = createEmptyState();
    state.bank = bank;
    state.mode = mode;
    state.domain = domain;
    state.questionIds = shuffle(selectedQuestions.map((question) => question.id));
    state.startedAt = Date.now();
    state.endsAt = mode === "timed" ? state.startedAt + EXAM_SECONDS * 1000 : null;
    saveState();
    showExam();
  }

  function resumeAttempt() {
    const saved = readSavedState();
    if (!saved || saved.submitted) {
      updateResumeCard(null);
      showToast("No active saved attempt was found.");
      return;
    }

    state = saved;
    setActiveBank(state.bank);
    if (state.mode === "timed" && Date.now() >= state.endsAt) {
      finalizeAttempt(true);
      return;
    }
    showExam();
  }

  function showExam() {
    showView("exam-view");
    elements["mode-pill"].textContent = state.mode === "timed" ? "Timed exam" : "Learning mode";
    elements["exam-domain-label"].textContent = `${BANKS[state.bank].label} | ${state.domain === "all" ? "All domains" : state.domain}`;
    elements["timer"].classList.toggle("is-hidden", state.mode !== "timed");
    elements["check-answer"].classList.toggle("is-hidden", state.mode !== "practice");
    elements["submit-exam"].textContent = state.mode === "timed" ? "Submit exam" : "Finish session";
    renderQuestion();
    setNavigatorCollapsed(window.matchMedia("(max-width: 720px)").matches);
    startTimer();
    jumpToTop();
  }

  function returnHome(event) {
    event.preventDefault();
    stopTimer();
    showView("landing-view");
    updateResumeCard(state.questionIds.length && !state.submitted ? state : null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showView(id) {
    document.querySelectorAll(".view").forEach((view) => {
      view.classList.toggle("is-active", view.id === id);
    });
  }

  function currentQuestion() {
    const id = state.questionIds[state.currentIndex];
    return questions.find((question) => question.id === id);
  }

  function orderedQuestions() {
    return state.questionIds
      .map((id) => questions.find((question) => question.id === id))
      .filter(Boolean);
  }

  function renderQuestion() {
    const question = currentQuestion();
    if (!question) {
      showToast("This question could not be loaded.");
      return;
    }

    const selected = state.answers[question.id] || [];
    const isRevealed = state.submitted || Boolean(state.checked[question.id]);

    elements["question-domain"].textContent = question.domain;
    elements["question-domain"].dataset.domain = question.domain;
    elements["question-position"].textContent = `Question ${state.currentIndex + 1} of ${state.questionIds.length}`;
    elements["question-heading"].textContent = question.prompt;
    elements["selection-instruction"].textContent = question.type === "multiple"
      ? `Select ${numberWord(question.selectCount)} answers.`
      : "Select one answer.";
    elements["mark-review"].checked = Boolean(state.marked[question.id]);
    elements.confidence.value = state.confidence[question.id] || "";
    elements["previous-question"].disabled = state.currentIndex === 0;
    elements["next-question"].firstChild.textContent =
      state.currentIndex === state.questionIds.length - 1 ? "Finish " : "Next ";

    elements["answer-options"].replaceChildren();
    question.options.forEach((option) => {
      const label = document.createElement("label");
      label.className = "answer-option";
      const input = document.createElement("input");
      input.type = question.type === "multiple" ? "checkbox" : "radio";
      input.name = `question-${question.id}`;
      input.value = option.id;
      input.checked = selected.includes(option.id);
      input.disabled = isRevealed;
      input.addEventListener("change", () => selectOption(question, option.id));

      const letter = document.createElement("span");
      letter.className = "option-letter";
      letter.textContent = option.id;
      const text = document.createElement("span");
      text.className = "option-text";
      text.textContent = option.text;

      label.append(input, letter, text);
      label.classList.toggle("is-selected", selected.includes(option.id));

      if (isRevealed) {
        label.classList.add("is-locked");
        if (question.answers.includes(option.id)) {
          label.classList.add("is-correct");
        } else if (selected.includes(option.id)) {
          label.classList.add("is-incorrect");
        }
      }

      elements["answer-options"].append(label);
    });

    elements["check-answer"].disabled =
      isRevealed || !hasCompleteAnswer(question, selected);
    renderFeedback(question, isRevealed);
    renderNavigator();
    renderProgress();
    saveState();
  }

  function selectOption(question, optionId) {
    if (state.submitted || state.checked[question.id]) {
      return;
    }

    const selected = [...(state.answers[question.id] || [])];
    if (question.type === "single") {
      state.answers[question.id] = [optionId];
    } else if (selected.includes(optionId)) {
      state.answers[question.id] = selected.filter((id) => id !== optionId);
    } else if (selected.length < question.selectCount) {
      state.answers[question.id] = [...selected, optionId];
    } else {
      showToast(`Select exactly ${question.selectCount} answers. Remove one before choosing another.`);
    }

    renderQuestion();
  }

  function renderFeedback(question, isRevealed) {
    elements["feedback-panel"].classList.toggle("is-hidden", !isRevealed);
    if (!isRevealed) {
      return;
    }

    const isCorrect = isCorrectAnswer(question);
    elements["feedback-panel"].classList.toggle("is-wrong", !isCorrect);
    elements["feedback-icon"].textContent = isCorrect ? "OK" : "X";
    elements["feedback-title"].textContent = isCorrect ? "Correct" : "Not quite";
    elements["feedback-explanation"].textContent = question.explanation;
    elements["feedback-reference"].href = referenceUrl(question.reference);
    elements["feedback-reference"].textContent = `Open AWS reference: ${question.reference}`;
  }

  function renderNavigator() {
    elements["question-grid"].replaceChildren();
    orderedQuestions().forEach((question, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(index + 1);
      button.title = `Question ${index + 1}: ${question.domain}`;
      button.classList.toggle("is-current", index === state.currentIndex);
      button.classList.toggle("is-answered", hasCompleteAnswer(question, state.answers[question.id] || []));
      button.classList.toggle("is-marked", Boolean(state.marked[question.id]));
      button.addEventListener("click", () => navigateToQuestion(index));
      elements["question-grid"].append(button);
    });
  }

  function renderProgress() {
    const list = orderedQuestions();
    const answered = list.filter((question) =>
      hasCompleteAnswer(question, state.answers[question.id] || [])
    ).length;
    const percent = list.length ? (answered / list.length) * 100 : 0;
    elements["answered-summary"].textContent = `${answered} of ${list.length} answered`;
    elements["progress-fill"].style.width = `${percent}%`;
  }

  function moveQuestion(delta) {
    navigateToQuestion(state.currentIndex + delta);
  }

  function navigateToQuestion(index) {
    if (index < 0 || index >= state.questionIds.length) {
      return;
    }
    state.currentIndex = index;
    renderQuestion();
    document.querySelector(".question-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleNextQuestion() {
    const question = currentQuestion();
    if (state.mode === "practice" && !state.checked[question.id]) {
      if (!hasCompleteAnswer(question, state.answers[question.id] || [])) {
        showToast("Choose the required number of answers before checking.");
      } else {
        showToast("Check the answer before moving to the next question.");
      }
      return;
    }

    if (state.currentIndex === state.questionIds.length - 1) {
      openSubmitDialog();
      return;
    }
    moveQuestion(1);
  }

  function checkCurrentAnswer() {
    const question = currentQuestion();
    const selected = state.answers[question.id] || [];
    if (!hasCompleteAnswer(question, selected)) {
      showToast(`Choose ${question.selectCount} answer${question.selectCount === 1 ? "" : "s"} first.`);
      return;
    }
    state.checked[question.id] = true;
    renderQuestion();
  }

  function updateMarkedState() {
    const question = currentQuestion();
    state.marked[question.id] = elements["mark-review"].checked;
    saveState();
    renderNavigator();
  }

  function updateConfidenceState() {
    const question = currentQuestion();
    if (elements.confidence.value) {
      state.confidence[question.id] = elements.confidence.value;
    } else {
      delete state.confidence[question.id];
    }
    saveState();
  }

  function toggleNavigator() {
    setNavigatorCollapsed(!elements["question-grid"].classList.contains("is-hidden"));
  }

  function setNavigatorCollapsed(collapsed) {
    elements["question-grid"].classList.toggle("is-hidden", collapsed);
    document.querySelector(".navigator-legend").classList.toggle("is-hidden", collapsed);
    elements["toggle-navigator"].textContent = collapsed ? "+" : "-";
    elements["toggle-navigator"].setAttribute("aria-expanded", String(!collapsed));
  }

  function openSubmitDialog() {
    const list = orderedQuestions();
    const unanswered = list.filter((question) =>
      !hasCompleteAnswer(question, state.answers[question.id] || [])
    ).length;
    elements["submit-dialog-copy"].textContent = unanswered
      ? `${unanswered} question${unanswered === 1 ? " is" : "s are"} unanswered. Unanswered questions will be scored as incorrect.`
      : "All questions have complete answers. You can submit when ready.";
    elements["submit-dialog"].returnValue = "";
    elements["submit-dialog"].showModal();
  }

  function finalizeAttempt(autoSubmitted) {
    if (!state.questionIds.length || state.submitted) {
      return;
    }
    state.submitted = true;
    state.completedAt = Date.now();
    stopTimer();
    saveState();
    renderResults();
    if (autoSubmitted) {
      showToast("Time expired. Your attempt was submitted automatically.");
    }
  }

  function renderResults() {
    const result = calculateResult();
    showView("results-view");

    elements["score-percent"].textContent = `${result.percent}%`;
    elements["score-ring"].style.background =
      `conic-gradient(var(--orange) ${result.percent * 3.6}deg, var(--border) 0deg)`;
    elements["correct-count"].textContent = result.correct;
    elements["incorrect-count"].textContent = result.incorrect;
    elements["unanswered-count"].textContent = result.unanswered;
    elements["time-used"].textContent = formatDuration(result.timeUsedSeconds);

    const readiness = readinessFor(result.percent);
    elements["results-title"].textContent = `${BANKS[state.bank].label} result`;
    elements["readiness-title"].textContent = readiness.title;
    elements["readiness-copy"].textContent = state.bank === "warmup"
      ? `${readiness.copy} The warmup bank is easier than the real exam, so treat this score as a floor and confirm it on The real deal.`
      : readiness.copy;
    elements["results-message"].textContent = readiness.message;
    elements["readiness-banner"].dataset.level = readiness.level;

    renderDomainBreakdown(result.domains);
    renderConfidenceInsight();
    elements["review-section"].classList.add("is-hidden");
    elements["review-answers"].textContent = "Review answers";
    activeReviewFilter = "all";
    document.querySelectorAll(".review-filters button").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === "all");
    });
    jumpToTop();
  }

  function calculateResult() {
    const list = orderedQuestions();
    let correct = 0;
    let unanswered = 0;
    const domains = {};

    list.forEach((question) => {
      const selected = state.answers[question.id] || [];
      const answered = hasCompleteAnswer(question, selected);
      const isCorrect = answered && isCorrectAnswer(question);
      correct += isCorrect ? 1 : 0;
      unanswered += answered ? 0 : 1;

      if (!domains[question.domain]) {
        domains[question.domain] = { total: 0, correct: 0 };
      }
      domains[question.domain].total += 1;
      domains[question.domain].correct += isCorrect ? 1 : 0;
    });

    const completedAt = state.completedAt || Date.now();
    const timeUsedSeconds = state.startedAt
      ? Math.max(0, Math.round((completedAt - state.startedAt) / 1000))
      : 0;

    return {
      total: list.length,
      correct,
      incorrect: list.length - correct - unanswered,
      unanswered,
      percent: list.length ? Math.round((correct / list.length) * 100) : 0,
      timeUsedSeconds,
      domains
    };
  }

  function renderDomainBreakdown(domains) {
    elements["domain-breakdown"].replaceChildren();
    Object.entries(domains).forEach(([domain, values]) => {
      const percent = values.total ? Math.round((values.correct / values.total) * 100) : 0;
      const row = document.createElement("div");
      row.className = "domain-result-row";

      const label = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = domain;
      const detail = document.createElement("small");
      detail.textContent = state.domain === "all"
        ? `${DOMAIN_WEIGHTS[domain]}% exam weight | ${values.correct} of ${values.total} correct`
        : `${values.correct} of ${values.total} correct`;
      label.append(name, detail);

      const bar = document.createElement("div");
      bar.className = "domain-bar";
      const fill = document.createElement("span");
      fill.style.width = `${percent}%`;
      if (percent < 70) {
        fill.style.background = "var(--red)";
      } else if (percent >= 80) {
        fill.style.background = "var(--green)";
      }
      bar.append(fill);

      const score = document.createElement("span");
      score.textContent = `${percent}%`;
      row.append(label, bar, score);
      elements["domain-breakdown"].append(row);
    });
  }

  function renderConfidenceInsight() {
    let highConfidenceWrong = 0;
    let lowConfidenceCorrect = 0;
    let rated = 0;

    orderedQuestions().forEach((question) => {
      const confidence = state.confidence[question.id];
      if (!confidence) {
        return;
      }
      rated += 1;
      if (confidence === "high" && !isCorrectAnswer(question)) {
        highConfidenceWrong += 1;
      }
      if (confidence === "low" && isCorrectAnswer(question)) {
        lowConfidenceCorrect += 1;
      }
    });

    if (!rated) {
      elements["confidence-copy"].textContent =
        "No confidence ratings were recorded. Use them next time to separate knowledge gaps from uncertainty.";
      return;
    }

    elements["confidence-copy"].textContent =
      `${rated} questions rated. ${highConfidenceWrong} high-confidence mistakes need immediate review, while ${lowConfidenceCorrect} low-confidence correct answers need reinforcement.`;
  }

  function showReview() {
    const hidden = elements["review-section"].classList.contains("is-hidden");
    elements["review-section"].classList.toggle("is-hidden", !hidden);
    elements["review-answers"].textContent = hidden ? "Hide answer review" : "Review answers";
    if (hidden) {
      renderReviewList();
      elements["review-section"].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderReviewList() {
    elements["review-list"].replaceChildren();
    const filtered = orderedQuestions().filter((question) => {
      if (activeReviewFilter === "incorrect") {
        return !isCorrectAnswer(question);
      }
      if (activeReviewFilter === "marked") {
        return Boolean(state.marked[question.id]);
      }
      return true;
    });

    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "disclaimer";
      empty.textContent = "No questions match this filter.";
      elements["review-list"].append(empty);
      return;
    }

    filtered.forEach((question) => {
      const correct = isCorrectAnswer(question);
      const selected = state.answers[question.id] || [];
      const item = document.createElement("article");
      item.className = `review-item ${correct ? "is-review-correct" : "is-review-incorrect"}`;

      const header = document.createElement("div");
      header.className = "review-item-header";
      const meta = document.createElement("div");
      const number = document.createElement("span");
      number.className = "review-number";
      number.textContent = `Question ${state.questionIds.indexOf(question.id) + 1}`;
      const badge = document.createElement("span");
      badge.className = "domain-badge";
      badge.dataset.domain = question.domain;
      badge.textContent = question.domain;
      meta.append(number, badge);

      const result = document.createElement("span");
      result.className = `review-result ${correct ? "correct" : "incorrect"}`;
      result.textContent = correct ? "Correct" : "Incorrect";
      header.append(meta, result);

      const prompt = document.createElement("h3");
      prompt.textContent = question.prompt;

      const yourAnswer = reviewAnswerLine(
        "Your answer",
        selected.length ? selected.map((id) => `${id}. ${optionText(question, id)}`).join(" | ") : "Unanswered"
      );
      const correctAnswer = reviewAnswerLine(
        "Correct answer",
        question.answers.map((id) => `${id}. ${optionText(question, id)}`).join(" | ")
      );

      const explanation = document.createElement("p");
      explanation.className = "review-explanation";
      explanation.textContent = question.explanation;

      const reference = document.createElement("a");
      reference.href = referenceUrl(question.reference);
      reference.target = "_blank";
      reference.rel = "noreferrer";
      reference.textContent = `AWS reference: ${question.reference}`;

      item.append(header, prompt, yourAnswer, correctAnswer, explanation, reference);
      elements["review-list"].append(item);
    });
  }

  function reviewAnswerLine(labelText, answerText) {
    const row = document.createElement("div");
    row.className = "review-answer-line";
    const label = document.createElement("strong");
    label.textContent = labelText;
    const value = document.createElement("span");
    value.textContent = answerText;
    row.append(label, value);
    return row;
  }

  function resetAttempt() {
    stopTimer();
    localStorage.removeItem(STORAGE_KEY);
    state = createEmptyState();
    updateResumeCard(null);
    showView("landing-view");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function discardSavedAttempt() {
    localStorage.removeItem(STORAGE_KEY);
    state = createEmptyState();
    updateResumeCard(null);
    showToast("Saved attempt discarded.");
  }

  function updateResumeCard(saved) {
    const valid = saved && saved.questionIds?.length && !saved.submitted;
    elements["resume-card"].classList.toggle("is-hidden", !valid);
    if (!valid) {
      return;
    }

    const savedBank = BANKS[saved.bank] ? saved.bank : "warmup";
    const savedQuestions = saved.questionIds
      .map((id) => BANKS[savedBank].questions.find((question) => question.id === id))
      .filter(Boolean);
    const answered = savedQuestions.filter((question) =>
      hasCompleteAnswer(question, saved.answers[question.id] || [])
    ).length;
    elements["resume-title"].textContent = `${BANKS[savedBank].label}: ${saved.mode === "timed" ? "timed exam" : "learning session"}`;
    elements["resume-details"].textContent = `${answered} of ${savedQuestions.length} answered`;
  }

  function startTimer() {
    stopTimer();
    if (state.mode !== "timed" || state.submitted) {
      return;
    }
    updateTimer();
    timerHandle = window.setInterval(updateTimer, 1000);
  }

  function stopTimer() {
    if (timerHandle) {
      window.clearInterval(timerHandle);
      timerHandle = null;
    }
  }

  function updateTimer() {
    const remaining = Math.max(0, Math.ceil((state.endsAt - Date.now()) / 1000));
    elements["timer-value"].textContent = formatClock(remaining);
    elements["timer"].classList.toggle("is-warning", remaining <= 15 * 60 && remaining > 5 * 60);
    elements["timer"].classList.toggle("is-critical", remaining <= 5 * 60);
    if (remaining <= 0) {
      finalizeAttempt(true);
    }
  }

  function handleKeyboardNavigation(event) {
    if (!elements["exam-view"].classList.contains("is-active") || state.submitted) {
      return;
    }
    if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
      return;
    }

    if (event.key === "ArrowLeft") {
      moveQuestion(-1);
    } else if (event.key === "ArrowRight") {
      handleNextQuestion();
    } else if (/^[1-5]$/.test(event.key)) {
      const question = currentQuestion();
      const option = question.options[Number(event.key) - 1];
      if (option) {
        selectOption(question, option.id);
      }
    } else if (event.key.toLowerCase() === "m") {
      elements["mark-review"].checked = !elements["mark-review"].checked;
      updateMarkedState();
    }
  }

  function saveState() {
    if (!state.questionIds.length) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function readSavedState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.questionIds)) {
        return null;
      }
      const bank = BANKS[parsed.bank] ? parsed.bank : "warmup";
      const validIds = new Set(BANKS[bank].questions.map((question) => question.id));
      if (!parsed.questionIds.length || parsed.questionIds.some((id) => !validIds.has(id))) {
        return null;
      }
      return { ...createEmptyState(), ...parsed, bank };
    } catch {
      return null;
    }
  }

  function hasCompleteAnswer(question, selected) {
    return selected.length === question.selectCount;
  }

  function isCorrectAnswer(question) {
    const selected = [...(state.answers[question.id] || [])].sort();
    const expected = [...question.answers].sort();
    return selected.length === expected.length &&
      selected.every((answer, index) => answer === expected[index]);
  }

  function optionText(question, id) {
    return question.options.find((option) => option.id === id)?.text || id;
  }

  function referenceUrl(reference) {
    if (/^https?:\/\//i.test(reference)) {
      return reference;
    }
    return `https://docs.aws.amazon.com/search/doc-search.html?searchPath=documentation&searchQuery=${encodeURIComponent(reference)}`;
  }

  function readinessFor(percent) {
    if (percent >= 85) {
      return {
        level: "strong",
        title: "Strong exam readiness",
        message: "Your result is above the coaching target.",
        copy: "Maintain this level across at least two more fresh timed mocks, then concentrate on explanations and high-confidence mistakes."
      };
    }
    if (percent >= 80) {
      return {
        level: "ready",
        title: "Approaching exam readiness",
        message: "You have reached the minimum coaching target.",
        copy: "Repeat this result on fresh questions and raise every domain above 75% before relying on it as evidence of readiness."
      };
    }
    if (percent >= 70) {
      return {
        level: "developing",
        title: "Developing",
        message: "You have a workable base with identifiable gaps.",
        copy: "Review every incorrect answer, repeat the weakest domain in learning mode, and take another timed attempt after targeted practice."
      };
    }
    return {
      level: "foundation",
      title: "Foundation building",
      message: "This is a useful starting diagnostic, not a failure.",
      copy: "Use learning mode to work through the two weakest domains. Prioritize understanding service behavior over memorizing answer wording."
    };
  }

  function shuffle(values) {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
  }

  function numberWord(value) {
    return ({ 1: "one", 2: "two", 3: "three" })[value] || String(value);
  }

  function formatClock(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
  }

  function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes >= 60) {
      return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    }
    return minutes ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  function jumpToTop() {
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = previousBehavior;
    });
  }

  function showToast(message) {
    window.clearTimeout(toastHandle);
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    toastHandle = window.setTimeout(() => {
      elements.toast.classList.remove("is-visible");
    }, 3200);
  }

  init();
})();
