const welcome = document.getElementById("welcome");
const chooseRole = document.getElementById("chooseRole");
const studentPage = document.getElementById("studentPage");
const teacherPage = document.getElementById("teacherPage");

function showPage(page) {
  [welcome, chooseRole, studentPage, teacherPage].forEach(section => {
    section.classList.add("hidden");
  });

  page.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("getStarted").addEventListener("click", () => {
  showPage(chooseRole);
});

document.getElementById("backHome").addEventListener("click", () => {
  showPage(welcome);
});

document.getElementById("studentButton").addEventListener("click", () => {
  showPage(studentPage);
});

document.getElementById("teacherButton").addEventListener("click", () => {
  showPage(teacherPage);
});

document.getElementById("backStudentRole").addEventListener("click", () => {
  showPage(chooseRole);
});

document.getElementById("backTeacherRole").addEventListener("click", () => {
  showPage(chooseRole);
});

// Sample multilingual learning content.
// These translations are written examples, not live AI translations.

const lessons = {
  en: [
    {
      title: "Plants Need Water",
      text: "Plants need water, sunlight and air to grow.",
      picture: "🌱",
      question: "What helps a plant grow?",
      options: ["🪨 Stones", "💧 Water", "🧸 Toys"],
      correct: 1
    },
    {
      title: "Animals and Their Homes",
      text: "Birds build nests to lay eggs and care for their young.",
      picture: "🐦",
      question: "Where does a bird usually build its nest?",
      options: ["🌳 In a tree", "🚗 In a car", "👟 In a shoe"],
      correct: 0
    },
    {
      title: "Healthy Food",
      text: "Fruits and vegetables help us stay healthy.",
      picture: "🍎",
      question: "Which is a fruit?",
      options: ["🪑 Chair", "🍎 Apple", "📚 Book"],
      correct: 1
    }
  ],

  kn: [
    {
      title: "ಸಸ್ಯಗಳಿಗೆ ನೀರು ಬೇಕು",
      text: "ಸಸ್ಯಗಳು ಬೆಳೆಯಲು ನೀರು, ಸೂರ್ಯನ ಬೆಳಕು ಮತ್ತು ಗಾಳಿ ಬೇಕು.",
      picture: "🌱",
      question: "ಸಸ್ಯಗಳು ಬೆಳೆಯಲು ಯಾವುದು ಸಹಾಯ ಮಾಡುತ್ತದೆ?",
      options: ["🪨 ಕಲ್ಲುಗಳು", "💧 ನೀರು", "🧸 ಆಟಿಕೆಗಳು"],
      correct: 1
    },
    {
      title: "ಪ್ರಾಣಿಗಳು ಮತ್ತು ಅವುಗಳ ಮನೆಗಳು",
      text: "ಪಕ್ಷಿಗಳು ಮೊಟ್ಟೆ ಇಡಲು ಮತ್ತು ಮರಿಗಳನ್ನು ನೋಡಿಕೊಳ್ಳಲು ಗೂಡು ಕಟ್ಟುತ್ತವೆ.",
      picture: "🐦",
      question: "ಪಕ್ಷಿಗಳು ಸಾಮಾನ್ಯವಾಗಿ ಎಲ್ಲಿ ಗೂಡು ಕಟ್ಟುತ್ತವೆ?",
      options: ["🌳 ಮರದಲ್ಲಿ", "🚗 ಕಾರಿನಲ್ಲಿ", "👟 ಶೂನಲ್ಲಿ"],
      correct: 0
    },
    {
      title: "ಆರೋಗ್ಯಕರ ಆಹಾರ",
      text: "ಹಣ್ಣುಗಳು ಮತ್ತು ತರಕಾರಿಗಳು ಆರೋಗ್ಯವಾಗಿರಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ.",
      picture: "🍎",
      question: "ಇವುಗಳಲ್ಲಿ ಹಣ್ಣು ಯಾವುದು?",
      options: ["🪑 ಕುರ್ಚಿ", "🍎 ಸೇಬು", "📚 ಪುಸ್ತಕ"],
      correct: 1
    }
  ],

  hi: [
    {
      title: "पौधों को पानी चाहिए",
      text: "पौधों को बढ़ने के लिए पानी, धूप और हवा चाहिए।",
      picture: "🌱",
      question: "पौधों को बढ़ने में क्या मदद करता है?",
      options: ["🪨 पत्थर", "💧 पानी", "🧸 खिलौने"],
      correct: 1
    },
    {
      title: "जानवर और उनके घर",
      text: "पक्षी अंडे देने और अपने बच्चों की देखभाल के लिए घोंसले बनाते हैं।",
      picture: "🐦",
      question: "पक्षी आमतौर पर घोंसला कहाँ बनाते हैं?",
      options: ["🌳 पेड़ पर", "🚗 कार में", "👟 जूते में"],
      correct: 0
    },
    {
      title: "स्वस्थ भोजन",
      text: "फल और सब्जियाँ हमें स्वस्थ रहने में मदद करती हैं।",
      picture: "🍎",
      question: "इनमें से फल कौन सा है?",
      options: ["🪑 कुर्सी", "🍎 सेब", "📚 किताब"],
      correct: 1
    }
  ],

  ta: [
    {
      title: "தாவரங்களுக்கு நீர் தேவை",
      text: "தாவரங்கள் வளர நீர், சூரிய ஒளி மற்றும் காற்று தேவை.",
      picture: "🌱",
      question: "தாவரங்கள் வளர எது உதவுகிறது?",
      options: ["🪨 கற்கள்", "💧 நீர்", "🧸 பொம்மைகள்"],
      correct: 1
    },
    {
      title: "விலங்குகளும் அவற்றின் வீடுகளும்",
      text: "பறவைகள் முட்டையிடவும் குஞ்சுகளைப் பராமரிக்கவும் கூடுகள் கட்டுகின்றன.",
      picture: "🐦",
      question: "பறவைகள் பொதுவாக எங்கே கூடு கட்டுகின்றன?",
      options: ["🌳 மரத்தில்", "🚗 காரில்", "👟 காலணியில்"],
      correct: 0
    },
    {
      title: "ஆரோக்கியமான உணவு",
      text: "பழங்களும் காய்கறிகளும் நம்மை ஆரோக்கியமாக வைத்திருக்க உதவுகின்றன.",
      picture: "🍎",
      question: "இவற்றில் பழம் எது?",
      options: ["🪑 நாற்காலி", "🍎 ஆப்பிள்", "📚 புத்தகம்"],
      correct: 1
    }
  ],

  te: [
    {
      title: "మొక్కలకు నీరు అవసరం",
      text: "మొక్కలు పెరగడానికి నీరు, సూర్యకాంతి మరియు గాలి అవసరం.",
      picture: "🌱",
      question: "మొక్కలు పెరగడానికి ఏది సహాయపడుతుంది?",
      options: ["🪨 రాళ్లు", "💧 నీరు", "🧸 బొమ్మలు"],
      correct: 1
    },
    {
      title: "జంతువులు మరియు వాటి నివాసాలు",
      text: "పక్షులు గుడ్లు పెట్టడానికి, పిల్లలను చూసుకోవడానికి గూళ్లు కడతాయి.",
      picture: "🐦",
      question: "పక్షులు సాధారణంగా ఎక్కడ గూడు కడతాయి?",
      options: ["🌳 చెట్టుపై", "🚗 కారులో", "👟 చెప్పులో"],
      correct: 0
    },
    {
      title: "ఆరోగ్యకరమైన ఆహారం",
      text: "పండ్లు మరియు కూరగాయలు ఆరోగ్యంగా ఉండటానికి సహాయపడతాయి.",
      picture: "🍎",
      question: "వీటిలో పండు ఏది?",
      options: ["🪑 కుర్చీ", "🍎 ఆపిల్", "📚 పుస్తకం"],
      correct: 1
    }
  ]
};

const languageSelect = document.getElementById("languageSelect");
const lessonTitle = document.getElementById("lessonTitle");
const lessonText = document.getElementById("lessonText");
const lessonPicture = document.getElementById("lessonPicture");
const lessonBadge = document.getElementById("lessonBadge");
const questionText = document.getElementById("questionText");
const answerFeedback = document.getElementById("answerFeedback");
const answerOptions = document.getElementById("answerOptions");
const nextQuestion = document.getElementById("nextQuestion");
const retryQuestion = document.getElementById("retryQuestion");
const achievementCard = document.getElementById("achievementCard");
const starCount = document.getElementById("starCount");
const questionProgress = document.getElementById("questionProgress");
const finalStars = document.getElementById("finalStars");

let currentLesson = 0;
let answeredLessons = new Set();
let earnedStars = 0;
let currentAnswered = false;

const languageMessages = {
  en: {
    instruction: "Choose the correct answer.",
    correct: "🎉 Wonderful! That's correct. You earned a star!",
    wrong: "💛 Good try! Listen to the lesson and try again.",
    next: "Next Activity →",
    finish: "See Your Achievement →",
    retry: "Try Again ↻",
    finished: "You completed all three learning activities!",
    stars: "You earned {n} stars!",
    progress: "Questions answered correctly"
  },
  kn: {
    instruction: "ಸರಿಯಾದ ಉತ್ತರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    correct: "🎉 ಅದ್ಭುತ! ಸರಿಯಾದ ಉತ್ತರ. ನಿಮಗೆ ಒಂದು ನಕ್ಷತ್ರ ಸಿಕ್ಕಿದೆ!",
    wrong: "💛 ಒಳ್ಳೆಯ ಪ್ರಯತ್ನ! ಪಾಠವನ್ನು ಕೇಳಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    next: "ಮುಂದಿನ ಚಟುವಟಿಕೆ →",
    finish: "ನಿಮ್ಮ ಸಾಧನೆಯನ್ನು ನೋಡಿ →",
    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ↻",
    finished: "ನೀವು ಮೂರು ಚಟುವಟಿಕೆಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
    stars: "ನಿಮಗೆ {n} ನಕ್ಷತ್ರಗಳು ಸಿಕ್ಕಿವೆ!",
    progress: "ಸರಿಯಾಗಿ ಉತ್ತರಿಸಿದ ಪ್ರಶ್ನೆಗಳು"
  },
  hi: {
    instruction: "सही उत्तर चुनें।",
    correct: "🎉 बहुत बढ़िया! सही जवाब। आपको एक सितारा मिला!",
    wrong: "💛 अच्छी कोशिश! पाठ सुनें और फिर से कोशिश करें।",
    next: "अगली गतिविधि →",
    finish: "अपनी उपलब्धि देखें →",
    retry: "फिर से कोशिश करें ↻",
    finished: "आपने तीनों गतिविधियाँ पूरी कर लीं!",
    stars: "आपको {n} सितारे मिले!",
    progress: "सही उत्तर दिए गए प्रश्न"
  },
  ta: {
    instruction: "சரியான பதிலைத் தேர்ந்தெடுக்கவும்.",
    correct: "🎉 அருமை! சரியான பதில். உங்களுக்கு ஒரு நட்சத்திரம் கிடைத்தது!",
    wrong: "💛 நல்ல முயற்சி! பாடத்தைக் கேட்டு மீண்டும் முயற்சிக்கவும்.",
    next: "அடுத்த செயல்பாடு →",
    finish: "உங்கள் சாதனையைப் பார்க்கவும் →",
    retry: "மீண்டும் முயற்சிக்கவும் ↻",
    finished: "மூன்று செயல்பாடுகளையும் முடித்துவிட்டீர்கள்!",
    stars: "உங்களுக்கு {n} நட்சத்திரங்கள் கிடைத்தன!",
    progress: "சரியாக பதிலளித்த கேள்விகள்"
  },
  te: {
    instruction: "సరైన సమాధానాన్ని ఎంచుకోండి.",
    correct: "🎉 అద్భుతం! సరైన సమాధానం. మీకు ఒక నక్షత్రం వచ్చింది!",
    wrong: "💛 మంచి ప్రయత్నం! పాఠం విని మళ్లీ ప్రయత్నించండి.",
    next: "తదుపరి కార్యకలాపం →",
    finish: "మీ విజయాన్ని చూడండి →",
    retry: "మళ్లీ ప్రయత్నించండి ↻",
    finished: "మీరు మూడు కార్యకలాపాలను పూర్తి చేశారు!",
    stars: "మీకు {n} నక్షత్రాలు వచ్చాయి!",
    progress: "సరిగ్గా సమాధానమిచ్చిన ప్రశ్నలు"
  }
};

function getLanguage() {
  return lessons[languageSelect.value] ? languageSelect.value : "en";
}

function getLesson() {
  return lessons[getLanguage()][currentLesson];
}

function getMessages() {
  return languageMessages[getLanguage()];
}

function updateScore() {
  starCount.textContent = earnedStars;
  questionProgress.textContent = `${answeredLessons.size} / ${lessons.en.length}`;
}

function renderLesson() {
  const lesson = getLesson();
  const messages = getMessages();

  currentAnswered = answeredLessons.has(currentLesson);

  lessonBadge.textContent = `LESSON ${currentLesson + 1} OF ${lessons.en.length}`;
  lessonPicture.textContent = lesson.picture;
  lessonTitle.textContent = lesson.title;
  lessonText.textContent = lesson.text;
  questionText.textContent = lesson.question;
  document.getElementById("questionInstruction").textContent =
    messages.instruction;

  answerFeedback.textContent = "";
  answerFeedback.className = "feedback";
  answerOptions.replaceChildren();

  lesson.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.textContent = option;
    button.dataset.index = index;
    button.disabled = currentAnswered;

    if (currentAnswered && index === lesson.correct) {
      button.classList.add("activity-tab", "active");
    }

    button.addEventListener("click", () => checkAnswer(index));
    answerOptions.appendChild(button);
  });

  retryQuestion.classList.add("hidden");
  nextQuestion.classList.toggle("hidden", !currentAnswered);

  nextQuestion.textContent =
    currentLesson === lessons.en.length - 1
      ? messages.finish
      : messages.next;

  if (currentAnswered) {
    answerFeedback.textContent = messages.correct;
    answerFeedback.className = "feedback success";
  }

  document.querySelectorAll(".activity-tab").forEach(tab => {
    tab.classList.toggle(
      "active",
      Number(tab.dataset.lesson) === currentLesson
    );
  });

  updateScore();
}

function checkAnswer(selectedIndex) {
  if (currentAnswered) return;

  const lesson = getLesson();
  const messages = getMessages();

  if (selectedIndex === lesson.correct) {
    currentAnswered = true;
    answeredLessons.add(currentLesson);
    earnedStars++;

    answerFeedback.textContent = messages.correct;
    answerFeedback.className = "feedback success";

    answerOptions.querySelectorAll("button").forEach(button => {
      button.disabled = true;
    });

    nextQuestion.classList.remove("hidden");
    retryQuestion.classList.add("hidden");

    nextQuestion.textContent =
      currentLesson === lessons.en.length - 1
        ? messages.finish
        : messages.next;

    updateScore();
  } else {
    answerFeedback.textContent = messages.wrong;
    answerFeedback.className = "feedback error";
    retryQuestion.classList.remove("hidden");
  }
}

document.querySelectorAll(".activity-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    currentLesson = Number(tab.dataset.lesson);
    renderLesson();

    setTimeout(() => {
      const lesson = getLesson();
      speakSAHAYA(`${lesson.title}. ${lesson.text}`);
    }, 300);
  });
});

languageSelect.addEventListener("change", () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  renderLesson();

  setTimeout(() => {
    const lesson = getLesson();
    speakSAHAYA(`${lesson.title}. ${lesson.text}`);
  }, 300);
});
retryQuestion.addEventListener("click", () => {
  renderLesson();
});
nextQuestion.addEventListener("click", () => {
  if (!currentAnswered) return;

  if (currentLesson < lessons.en.length - 1) {
    currentLesson++;
    renderLesson();

    // Automatically speak the next lesson
    setTimeout(() => {
      const lesson = getLesson();
      speakSAHAYA(`${lesson.title}. ${lesson.text}`);
    }, 400);

  } else {
    const messages = getMessages();

    document.querySelector(".interactive-lesson").classList.add("hidden");
    document.querySelector(".quiz-card").classList.add("hidden");
    achievementCard.classList.remove("hidden");

    achievementCard.querySelector("p").textContent = messages.finished;
    finalStars.textContent = messages.stars.replace("{n}", earnedStars);

    // Celebrate completion
    speakSAHAYA(messages.finished);
  }
});

document.getElementById("restartLearning").addEventListener("click", () => {
  currentLesson = 0;
  answeredLessons = new Set();
  earnedStars = 0;
  currentAnswered = false;

  document.querySelector(".interactive-lesson").classList.remove("hidden");
  document.querySelector(".quiz-card").classList.remove("hidden");
  achievementCard.classList.add("hidden");

  renderLesson();
});

document.getElementById("listenButton").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) {
    answerFeedback.textContent =
      "Audio playback is not supported in this browser.";
    answerFeedback.className = "feedback error";
    return;
  }

  const languageCodes = {
    en: "en-IN",
    kn: "kn-IN",
    hi: "hi-IN",
    ta: "ta-IN",
    te: "te-IN"
  };

  const lesson = getLesson();
  const utterance = new SpeechSynthesisUtterance(
    `${lesson.title}. ${lesson.text}`
  );

  utterance.lang = languageCodes[getLanguage()];
  utterance.rate = 0.85;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
});

// Keep the lesson screen ready when the student opens it.
document.getElementById("studentButton").addEventListener("click", () => {
  renderLesson();
});

console.log("SAHAYA Task 3 loaded successfully.");
/* SAHAYA Task 4: Voice Assistant */
function speakSAHAYA(message) {
  if (!("speechSynthesis" in window)) {
    alert("Speech is not supported in this browser.");
    return;
  }

  const language =
    document.getElementById("languageSelect")?.value || "en";

  const languageCodes = {
    en: "en-IN",
    kn: "kn-IN",
    hi: "hi-IN",
    ta: "ta-IN",
    te: "te-IN"
  };

  const targetLanguage = languageCodes[language] || "en-IN";
  const voices = window.speechSynthesis.getVoices();

  const matchingVoice = voices.find(voice =>
    voice.lang.toLowerCase() === targetLanguage.toLowerCase()
  ) || voices.find(voice =>
    voice.lang.toLowerCase().startsWith(language)
  );

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(message);
  speech.lang = targetLanguage;
  speech.rate = 0.8;
  speech.pitch = 1;

  if (matchingVoice) {
    speech.voice = matchingVoice;
  }

  window.speechSynthesis.speak(speech);
}
/* Multilingual welcome voice */

document.getElementById("studentButton").addEventListener("click", () => {
  setTimeout(() => {
    const language =
      document.getElementById("languageSelect")?.value || "en";

    const welcomeMessages = {
      en: "Welcome to SAHAYA. Choose a lesson and start learning.",
      kn: "ಸಹಾಯಕ್ಕೆ ಸ್ವಾಗತ. ಒಂದು ಪಾಠವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ.",
      hi: "सहाय में आपका स्वागत है। एक पाठ चुनें और सीखना शुरू करें।",
      ta: "சஹாயாவிற்கு வரவேற்கிறோம். ஒரு பாடத்தைத் தேர்ந்தெடுத்து கற்கத் தொடங்குங்கள்.",
      te: "సహాయకు స్వాగతం. ఒక పాఠాన్ని ఎంచుకుని నేర్చుకోవడం ప్రారంభించండి."
    };

    speakSAHAYA(welcomeMessages[language] || welcomeMessages.en);
  }, 700);
});
/* Speak welcome message whenever language changes */

const sahayaLanguageSelect = document.getElementById("languageSelect");

if (sahayaLanguageSelect) {
  sahayaLanguageSelect.addEventListener("change", () => {
    const language = sahayaLanguageSelect.value;

    const welcomeMessages = {
      en: "Welcome to SAHAYA! Choose a lesson and start learning.",
      kn: "ಸಹಾಯಕ್ಕೆ ಸ್ವಾಗತ! ಒಂದು ಪಾಠವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ.",
      hi: "सहाय में आपका स्वागत है! एक पाठ चुनें और सीखना शुरू करें।",
      ta: "சஹாயாவிற்கு வரவேற்கிறோம்! ஒரு பாடத்தைத் தேர்ந்தெடுத்து கற்கத் தொடங்குங்கள்.",
      te: "సహాయకు స్వాగతం! ఒక పాఠాన్ని ఎంచుకుని నేర్చుకోవడం ప్రారంభించండి."
    };

    speakSAHAYA(welcomeMessages[language] || welcomeMessages.en);
  });
}
/* SAHAYA Task 5: Voice-based quiz answers */

const voiceAnswerButton = document.getElementById("voiceAnswerButton");
const voiceStatus = document.getElementById("voiceStatus");

const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (voiceAnswerButton && voiceStatus) {
  if (!SpeechRecognitionAPI) {
    voiceAnswerButton.addEventListener("click", () => {
      voiceStatus.textContent =
        "Voice recognition is not supported here. Please use Google Chrome.";
    });
  } else {
    const recognition = new SpeechRecognitionAPI();

    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    voiceAnswerButton.addEventListener("click", () => {
      const language = languageSelect.value;

      const speechLanguages = {
        en: "en-IN",
        kn: "kn-IN",
        hi: "hi-IN",
        ta: "ta-IN",
        te: "te-IN"
      };

      recognition.lang = speechLanguages[language] || "en-IN";
      voiceStatus.textContent = "🎤 Listening... Speak your answer now.";
      voiceAnswerButton.disabled = true;

      try {
        recognition.start();
      } catch (error) {
        voiceStatus.textContent =
          "Please wait a moment and try the microphone again.";
        voiceAnswerButton.disabled = false;
      }
    });

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript
        .toLowerCase()
        .trim();

      voiceStatus.textContent = `You said: "${spokenText}"`;

      const lesson = getLesson();

      const normalize = (text) =>
        text
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s]/gu, "")
          .trim();

      const spoken = normalize(spokenText);

      const matchingOption = lesson.options.findIndex((option) => {
        const cleanOption = normalize(option.replace(/^\S+\s*/, ""));
        return spoken.includes(cleanOption) || cleanOption.includes(spoken);
      });

      if (matchingOption !== -1) {
        checkAnswer(matchingOption);
      } else {
        voiceStatus.textContent +=
          " — I couldn't match that answer. Please try again or tap an answer.";
      }
    };

    recognition.onerror = (event) => {
      const messages = {
        "not-allowed": "Microphone access denied. Allow microphone access in Chrome.",
        "no-speech": "I couldn't hear you. Please try speaking again.",
        "audio-capture": "No microphone was detected on your device.",
        "network": "Speech recognition needs a network connection. Please check your internet."
      };

      voiceStatus.textContent =
        messages[event.error] || `Voice recognition error: ${event.error}`;
    };

    recognition.onend = () => {
      voiceAnswerButton.disabled = false;
    };
  }
}