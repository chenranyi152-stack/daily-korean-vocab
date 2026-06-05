"use client";

import React, { useState, useEffect } from "react";

// Vocab Item Interface
interface VocabItem {
  id: string;
  word: string;
  romanization: string;
  meaning: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'phrase' | 'adverb';
  exampleKorean: string;
  exampleEnglish: string;
  difficulty: 'Beginner' | 'Intermediate';
}

const vocabList: VocabItem[] = [
  {
    id: '1',
    word: '안녕하세요',
    romanization: 'an-nyeong-ha-se-yo',
    meaning: 'Hello / How are you',
    partOfSpeech: 'phrase',
    exampleKorean: '안녕하세요! 오랜만이에요.',
    exampleEnglish: 'Hello! It has been a long time.',
    difficulty: 'Beginner'
  },
  {
    id: '2',
    word: '사랑',
    romanization: 'sa-rang',
    meaning: 'Love',
    partOfSpeech: 'noun',
    exampleKorean: '한국 영화와 음악을 사랑해요.',
    exampleEnglish: 'I love Korean movies and music.',
    difficulty: 'Beginner'
  },
  {
    id: '3',
    word: '감사합니다',
    romanization: 'gam-sa-ham-ni-da',
    meaning: 'Thank you',
    partOfSpeech: 'phrase',
    exampleKorean: '도와주셔서 감사합니다.',
    exampleEnglish: 'Thank you for helping me.',
    difficulty: 'Beginner'
  },
  {
    id: '4',
    word: '행복하다',
    romanization: 'haeng-bok-ha-da',
    meaning: 'To be happy',
    partOfSpeech: 'adjective',
    exampleKorean: '저는 지금 아주 행복해요.',
    exampleEnglish: 'I am very happy right now.',
    difficulty: 'Beginner'
  },
  {
    id: '5',
    word: '친구',
    romanization: 'chin-gu',
    meaning: 'Friend',
    partOfSpeech: 'noun',
    exampleKorean: '우리는 고등학교 때부터 친구예요.',
    exampleEnglish: 'We have been friends since high school.',
    difficulty: 'Beginner'
  },
  {
    id: '6',
    word: '배우다',
    romanization: 'bae-u-da',
    meaning: 'To learn',
    partOfSpeech: 'verb',
    exampleKorean: '저는 한국어를 배우고 있어요.',
    exampleEnglish: 'I am learning Korean.',
    difficulty: 'Beginner'
  },
  {
    id: '7',
    word: '맛있다',
    romanization: 'ma-sit-da',
    meaning: 'To be delicious',
    partOfSpeech: 'adjective',
    exampleKorean: '이 비빔밥은 정말 맛있어요.',
    exampleEnglish: 'This bibimbap is really delicious.',
    difficulty: 'Beginner'
  },
  {
    id: '8',
    word: '시간',
    romanization: 'si-gan',
    meaning: 'Time / Hour',
    partOfSpeech: 'noun',
    exampleKorean: '오늘 공부할 시간이 있어요?',
    exampleEnglish: 'Do you have time to study today?',
    difficulty: 'Intermediate'
  },
  {
    id: '9',
    word: '노래하다',
    romanization: 'no-rae-ha-da',
    meaning: 'To sing',
    partOfSpeech: 'verb',
    exampleKorean: '친구가 노래를 아주 잘해요.',
    exampleEnglish: 'My friend sings very well.',
    difficulty: 'Beginner'
  },
  {
    id: '10',
    word: '가족',
    romanization: 'ga-jok',
    meaning: 'Family',
    partOfSpeech: 'noun',
    exampleKorean: '우리 가족은 네 명이에요.',
    exampleEnglish: 'There are four people in my family.',
    difficulty: 'Beginner'
  }
];

export default function Home() {
  // Navigation & Interactive state
  const [activeTab, setActiveTab] = useState<'today' | 'bank' | 'quiz'>('today');
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  
  // Progress states (hydrated from localStorage safely in useEffect)
  const [learnedWords, setLearnedWords] = useState<string[]>([]);
  const [streak, setStreak] = useState<number>(3); // Mock initial streak
  const [showConfettiEffect, setShowConfettiEffect] = useState<boolean>(false);
  
  // Explorer/Bank states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [posFilter, setPosFilter] = useState<string>("all");
  
  // Quiz states
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    word: VocabItem;
    options: string[];
    correctIndex: number;
  }>>([]);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);

  // Safe client-side hydration
  useEffect(() => {
    const savedLearned = localStorage.getItem("learned_words");
    if (savedLearned) {
      try {
        setLearnedWords(JSON.parse(savedLearned));
      } catch (e) {
        console.error(e);
      }
    }
    const savedStreak = localStorage.getItem("vocab_streak");
    if (savedStreak) {
      setStreak(Number(savedStreak));
    }
  }, []);

  const saveLearnedToLocalStorage = (newLearned: string[]) => {
    setLearnedWords(newLearned);
    localStorage.setItem("learned_words", JSON.stringify(newLearned));
  };

  // Speaks words in Korean TTS
  const speakWord = (wordText: string) => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8; // Learner-friendly speed
      
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      // Audio fallback simulation
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 1200);
    }
  };

  // Confetti Particle System
  const triggerConfetti = () => {
    if (typeof window === "undefined") return;
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const colors = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 100,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 12,
        speedY: (Math.random() - 0.8) * 14 - 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8
      });
    }

    let animationFrame: number;
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.3; // Gravity
        p.speedX *= 0.98; // Friction
        p.rotation += p.rotationSpeed;

        if (p.y < canvas.height && p.x > 0 && p.x < canvas.width) {
          active = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (active) {
        animationFrame = requestAnimationFrame(update);
      } else {
        document.body.removeChild(canvas);
      }
    };

    update();
  };

  // Initialize Quiz questions
  const generateQuiz = () => {
    const questions = [];
    const shuffled = [...vocabList].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3); // 3 questions per session
    
    for (const word of selected) {
      // Generate distractors
      const distractors = vocabList
        .filter(w => w.id !== word.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.meaning);
      
      const options = [word.meaning, ...distractors].sort(() => 0.5 - Math.random());
      const correctIndex = options.indexOf(word.meaning);
      
      questions.push({
        word,
        options,
        correctIndex
      });
    }
    
    setQuizQuestions(questions);
    setQuizIndex(0);
    setSelectedAnswer(null);
    setAnswerStatus(null);
    setQuizScore(0);
    setQuizStarted(true);
  };

  const handleQuizAnswer = (option: string) => {
    if (selectedAnswer !== null) return; // Answer already submitted
    
    setSelectedAnswer(option);
    const correctOption = quizQuestions[quizIndex].options[quizQuestions[quizIndex].correctIndex];
    
    if (option === correctOption) {
      setAnswerStatus('correct');
      setQuizScore(prev => prev + 1);
      triggerConfetti();
    } else {
      setAnswerStatus('incorrect');
    }
  };

  const nextQuizQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswerStatus(null);
    } else {
      // Completed Quiz
      if (quizScore === quizQuestions.length) {
        // Perfect score reward streak extension
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem("vocab_streak", String(newStreak));
        triggerConfetti();
        setTimeout(triggerConfetti, 400);
      }
      setQuizIndex(quizQuestions.length);
    }
  };

  // Toggle Learned status of current word
  const toggleLearned = (wordId: string) => {
    let updated;
    if (learnedWords.includes(wordId)) {
      updated = learnedWords.filter(id => id !== wordId);
    } else {
      updated = [...learnedWords, wordId];
      triggerConfetti();
      // Increase streak if it's the first word today
      if (learnedWords.length === 0) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem("vocab_streak", String(newStreak));
      }
    }
    saveLearnedToLocalStorage(updated);
  };

  const currentWord = vocabList[currentWordIndex];

  // Filters vocab list
  const filteredVocab = vocabList.filter(item => {
    const matchesSearch = 
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.romanization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = posFilter === "all" || item.partOfSpeech === posFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen pb-20 select-none">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-8 md:pt-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 pb-6 border-b border-slate-800/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                DAILY STUDY PORTAL
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1 bg-gradient-to-r from-slate-100 via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              데일리 한국어
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Master Korean vocabulary, one day and one word at a time.
            </p>
          </div>

          {/* Quick Stats Panel */}
          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div className="glass px-4 py-2.5 rounded-2xl flex items-center gap-2.5 transition-all duration-300 hover:border-indigo-500/40 group">
              <div className="relative">
                <svg className="w-6 h-6 text-rose-500 fill-current animate-bounce group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/>
                  <path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                </svg>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Streak</div>
                <div className="text-base font-bold text-slate-200">{streak} Days</div>
              </div>
            </div>

            {/* Daily Progress */}
            <div className="glass px-4 py-2.5 rounded-2xl flex items-center gap-2.5 transition-all duration-300 hover:border-emerald-500/40">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-content-center text-emerald-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Learned</div>
                <div className="text-base font-bold text-slate-200">{learnedWords.length}/{vocabList.length}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Switcher */}
        <nav className="flex gap-2 p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-2 px-3 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'today'
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/35"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Daily Focus
          </button>
          
          <button
            onClick={() => setActiveTab('bank')}
            className={`flex-1 py-2 px-3 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'bank'
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/35"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Vocab Bank
          </button>

          <button
            onClick={() => {
              setActiveTab('quiz');
              setQuizStarted(false);
            }}
            className={`flex-1 py-2 px-3 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'quiz'
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/35"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.904-4.473L21 21l-1.187-5.096A9.705 9.705 0 119.813 15.904z" />
            </svg>
            Daily Quiz
          </button>
        </nav>

        {/* Tab 1: Daily Focus */}
        {activeTab === 'today' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                Word of the Day
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-400">
                Word {currentWordIndex + 1} of {vocabList.length}
              </span>
            </div>

            {/* Flashcard Component */}
            <div className="perspective-1000 max-w-md mx-auto h-[320px]">
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`w-full h-full relative transform-style-3d transition-transform duration-700 cursor-pointer ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full glass rounded-3xl p-8 flex flex-col justify-between backface-hidden shadow-2xl shadow-indigo-950/20 hover:border-indigo-500/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-xs uppercase tracking-wider font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/15">
                      {currentWord.partOfSpeech}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                      {currentWord.difficulty}
                    </span>
                  </div>

                  <div className="text-center space-y-3">
                    <h3 className="text-5xl md:text-6xl font-extrabold tracking-wide text-white font-korean">
                      {currentWord.word}
                    </h3>
                    <p className="text-sm font-semibold text-indigo-300 tracking-wider font-mono">
                      /{currentWord.romanization}/
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-slate-400">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid card flipping
                        speakWord(currentWord.word);
                      }}
                      className="w-10 h-10 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center hover:scale-105 active:scale-95"
                      aria-label="Speak word"
                    >
                      {isPlayingAudio ? (
                        <span className="flex items-center gap-0.5">
                          <span className="w-1 h-3 bg-current rounded-full animate-bounce [animation-delay:0.1s]" />
                          <span className="w-1 h-4 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1 h-3 bg-current rounded-full animate-bounce [animation-delay:0.3s]" />
                        </span>
                      ) : (
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 3v18l-6-6H2V9h4l6-6zm4 9c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                        </svg>
                      )}
                    </button>

                    <span className="text-xs flex items-center gap-1.5">
                      Click card to reveal meaning
                      <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 w-full h-full glass rounded-3xl p-8 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl shadow-indigo-950/20 hover:border-emerald-500/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/15">
                      Meaning
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      learnedWords.includes(currentWord.id)
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {learnedWords.includes(currentWord.id) ? "Learned ✓" : "Not Learned"}
                    </span>
                  </div>

                  <div className="text-center space-y-4">
                    <h4 className="text-3xl font-extrabold text-slate-100">
                      {currentWord.meaning}
                    </h4>
                    
                    <div className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800/40 text-left space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Example Sentence</div>
                      <p className="text-sm font-medium text-slate-200">{currentWord.exampleKorean}</p>
                      <p className="text-xs text-slate-400 italic">{currentWord.exampleEnglish}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-slate-400">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentWord.exampleKorean);
                      }}
                      className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 hover:text-white transition-colors border border-slate-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                      </svg>
                      Read Example
                    </button>
                    <span className="text-xs">Click to show word card</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8">
              <button
                onClick={() => toggleLearned(currentWord.id)}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 hover:scale-102 active:scale-98 cursor-pointer ${
                  learnedWords.includes(currentWord.id)
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 border border-emerald-500/20"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {learnedWords.includes(currentWord.id) ? "Marked as Learned" : "Mark as Learned"}
              </button>

              <div className="flex w-full sm:w-auto gap-3">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentWordIndex((prev) => (prev > 0 ? prev - 1 : vocabList.length - 1));
                  }}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-800 flex items-center justify-center gap-1.5"
                >
                  Prev
                </button>
                
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentWordIndex((prev) => (prev < vocabList.length - 1 ? prev + 1 : 0));
                  }}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-1.5"
                >
                  Next Word
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Tab 2: Vocab Bank */}
        {activeTab === 'bank' && (
          <section className="space-y-6">
            {/* Search and filter controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by word, meaning, or pronunciation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              {/* POS Selector */}
              <div className="flex gap-2">
                <select
                  value={posFilter}
                  onChange={(e) => setPosFilter(e.target.value)}
                  className="px-4 py-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="noun">Nouns</option>
                  <option value="verb">Verbs</option>
                  <option value="adjective">Adjectives</option>
                  <option value="phrase">Phrases</option>
                </select>
              </div>
            </div>

            {/* Vocab Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVocab.map((item) => (
                <div
                  key={item.id}
                  onClick={() => speakWord(item.word)}
                  className="glass p-5 rounded-2xl hover:border-indigo-500/30 transition-all duration-300 group cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                        {item.partOfSpeech}
                      </span>
                      <h4 className="text-2xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                        {item.word}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLearned(item.id);
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                        learnedWords.includes(item.id)
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300"
                      }`}
                      title={learnedWords.includes(item.id) ? "Marked as learned" : "Mark as learned"}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <p className="text-xs text-indigo-300 tracking-wider font-mono">/{item.romanization}/</p>
                    <p className="text-sm font-semibold text-slate-300 mt-1">{item.meaning}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/40 text-[11px] text-slate-500">
                    Ex: <span className="text-slate-400">{item.exampleKorean}</span>
                  </div>
                </div>
              ))}
            </div>

            {filteredVocab.length === 0 && (
              <div className="text-center py-12 glass rounded-2xl">
                <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-slate-400 font-semibold">No words match your filter criteria.</p>
                <button
                  onClick={() => { setSearchQuery(""); setPosFilter("all"); }}
                  className="mt-3 px-4 py-2 bg-indigo-600/10 text-indigo-400 text-xs font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors border border-indigo-500/20"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* Tab 3: Daily Quiz */}
        {activeTab === 'quiz' && (
          <section className="max-w-lg mx-auto">
            {!quizStarted ? (
              <div className="glass rounded-3xl p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.904-4.473L21 21l-1.187-5.096A9.705 9.705 0 119.813 15.904z" />
                  </svg>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-slate-100">Daily Vocabulary Challenge</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Test your memory of the vocabulary list with a 3-question mini-quiz. Perfect scores extend your daily streak!
                  </p>
                </div>

                <button
                  onClick={generateQuiz}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-600/35 hover:scale-102 active:scale-98 cursor-pointer"
                >
                  Start Quiz
                </button>
              </div>
            ) : (
              <div>
                {/* Quiz Active */}
                {quizIndex < quizQuestions.length ? (
                  <div className="glass rounded-3xl p-8 space-y-6">
                    {/* Quiz Progress Header */}
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                      <span>QUESTION {quizIndex + 1} OF {quizQuestions.length}</span>
                      <span>Score: {quizScore}</span>
                    </div>

                    {/* Question Card */}
                    <div className="text-center py-6 border-b border-slate-800/40">
                      <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">What does this word mean?</span>
                      <h3 className="text-4xl font-extrabold text-white mt-2 font-korean">{quizQuestions[quizIndex].word.word}</h3>
                      <p className="text-sm text-indigo-300 font-mono tracking-wide mt-1">/{quizQuestions[quizIndex].word.romanization}/</p>
                    </div>

                    {/* Options list */}
                    <div className="space-y-3">
                      {quizQuestions[quizIndex].options.map((option, idx) => {
                        const isCorrectOption = option === quizQuestions[quizIndex].word.meaning;
                        const isSelected = selectedAnswer === option;
                        
                        let optionStyle = "border-slate-800 bg-slate-900/40 text-slate-300 hover:border-indigo-500/30 hover:bg-slate-900/60";
                        
                        if (selectedAnswer !== null) {
                          if (isCorrectOption) {
                            optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold";
                          } else if (isSelected) {
                            optionStyle = "border-rose-500 bg-rose-500/10 text-rose-400 font-semibold";
                          } else {
                            optionStyle = "border-slate-900 bg-slate-900/20 text-slate-600";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={selectedAnswer !== null}
                            onClick={() => handleQuizAnswer(option)}
                            className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-300 flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{option}</span>
                            
                            {selectedAnswer !== null && (
                              <span>
                                {isCorrectOption && (
                                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                )}
                                {isSelected && !isCorrectOption && (
                                  <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Action Footer */}
                    {selectedAnswer !== null && (
                      <button
                        onClick={nextQuizQuestion}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-1.5 hover:scale-102 active:scale-98"
                      >
                        {quizIndex === quizQuestions.length - 1 ? "View Results" : "Next Question"}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    )}
                  </div>
                ) : (
                  /* Quiz End screen */
                  <div className="glass rounded-3xl p-8 text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-amber-400 fill-current animate-pulse" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-extrabold text-slate-100">Quiz Complete!</h3>
                      <p className="text-sm text-slate-400">
                        {quizScore === quizQuestions.length 
                          ? "Perfect Score! You received streak bonus and mastered today's vocab." 
                          : `Great job! You answered ${quizScore} of ${quizQuestions.length} correctly.`}
                      </p>
                    </div>

                    {/* Score display */}
                    <div className="text-4xl font-extrabold text-indigo-400 bg-indigo-500/10 py-4 px-6 rounded-2xl border border-indigo-500/20 max-w-[160px] mx-auto">
                      {quizScore} / {quizQuestions.length}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setQuizStarted(false)}
                        className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition-colors border border-slate-800"
                      >
                        Back to Quiz Menu
                      </button>
                      <button
                        onClick={generateQuiz}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/35 transition-all hover:scale-102 active:scale-98"
                      >
                        Retake Quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
