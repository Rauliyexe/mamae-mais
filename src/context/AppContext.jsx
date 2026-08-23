import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PREGNANCY_DATA } from "../data/mockData";
import { ACHIEVEMENTS } from "../data/achievements";
import useLocalStorage from "../hooks/useLocalStorage";

const AppContext = createContext();

// ── Helper: get today's date string ──
const todayStr = () => new Date().toISOString().slice(0, 10);

// ── Helper: calculate gestational week from LMP date ──
function calcWeekFromLMP(lmpDate) {
  if (!lmpDate) return 17;
  const lmp = new Date(lmpDate);
  if (isNaN(lmp.getTime())) return 17;
  const diffMs = Date.now() - lmp.getTime();
  const weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  return Math.max(4, Math.min(42, weeks));
}

// ── Helper: calculate days remaining until due date ──
function calcDaysRemaining(dueDate) {
  if (!dueDate) return 0;
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return 0;
  const diffMs = due.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
}

// ── Helper: get trimester from week ──
function getTrimester(week) {
  if (week <= 13) return 1;
  if (week <= 26) return 2;
  return 3;
}

// ── Helper: calculate diary streak ──
function calcStreak(entries) {
  if (!entries || entries.length === 0) return 0;
  // Simple streak counter based on number of entries with different dates
  const dates = [...new Set(entries.map((e) => e.savedDate).filter(Boolean))].sort().reverse();
  if (dates.length === 0) return entries.length > 0 ? 1 : 0;
  
  let streak = 1;
  const today = new Date(todayStr());
  const lastDate = new Date(dates[0]);
  const diffDays = Math.floor((today - lastDate) / (24 * 60 * 60 * 1000));
  if (diffDays > 1) return 0; // Streak broken
  
  for (let i = 1; i < dates.length; i++) {
    const curr = new Date(dates[i - 1]);
    const prev = new Date(dates[i]);
    const gap = Math.floor((curr - prev) / (24 * 60 * 60 * 1000));
    if (gap === 1) streak++;
    else break;
  }
  return streak;
}

export function AppProvider({ children }) {
  // ══════════════════════════════════════════════
  // NAVIGATION
  // ══════════════════════════════════════════════
  const [currentScreen, setCurrentScreen] = useState("login");
  const [history, setHistory] = useState([]);

  const navigate = (screen) => {
    setHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((prevList) => prevList.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      setCurrentScreen(isLoggedIn ? "inicio" : "login");
    }
  };

  // ══════════════════════════════════════════════
  // AUTH & USER (persisted)
  // ══════════════════════════════════════════════
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("mamae_logged_in", false);
  const [user, setUser] = useLocalStorage("mamae_user", {
    name: "Carla Silva",
    email: "carlasilva@gmail.com",
    lmpDate: "2026-03-10",
    weeks: 17,
    dueDate: "2026-12-15",
    isFirstPregnancy: true,
    location: "São Paulo, Brasil"
  });
  const [onboardingCompleted, setOnboardingCompleted] = useLocalStorage("mamae_onboarding", false);

  // ══════════════════════════════════════════════
  // GESTATIONAL CALCULATIONS (Module 2)
  // ══════════════════════════════════════════════
  const currentWeek = calcWeekFromLMP(user.lmpDate);
  const daysRemaining = calcDaysRemaining(user.dueDate);
  const progressPercent = Math.min(100, Math.round((currentWeek / 40) * 100));
  const trimester = getTrimester(currentWeek);
  const [week, setWeek] = useLocalStorage("mamae_week", currentWeek);

  // ══════════════════════════════════════════════
  // MOOD & MOOD HISTORY (Module 4)
  // ══════════════════════════════════════════════
  const [mood, setMoodRaw] = useLocalStorage("mamae_mood_today", null);
  const [moodHistory, setMoodHistory] = useLocalStorage("mamae_mood_history", []);

  const setMood = (newMood) => {
    setMoodRaw(newMood);
    const today = todayStr();
    setMoodHistory((prev) => {
      const filtered = prev.filter((m) => m.date !== today);
      return [{ date: today, mood: newMood, week: currentWeek }, ...filtered];
    });
  };

  const getMoodStats = (days = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const recent = moodHistory.filter((m) => new Date(m.date) >= cutoff);
    const counts = { triste: 0, confusa: 0, bem: 0, otima: 0 };
    recent.forEach((m) => { if (counts[m.mood] !== undefined) counts[m.mood]++; });
    return { counts, total: recent.length };
  };

  // ══════════════════════════════════════════════
  // DIARY (Module 4 enriched, persisted)
  // ══════════════════════════════════════════════
  const [diaryEntries, setDiaryEntries] = useLocalStorage("mamae_diary", PREGNANCY_DATA.initialDiaryEntries);
  const [hydrationDays, setHydrationDays] = useLocalStorage("mamae_hydration_days", 0);
  const [activityDays, setActivityDays] = useLocalStorage("mamae_activity_days", 0);

  const diaryStreak = calcStreak(diaryEntries);

  const addDiaryEntry = (entry) => {
    const enrichedEntry = {
      ...entry,
      savedDate: todayStr(),
      week: currentWeek,
    };
    setDiaryEntries((prev) => [enrichedEntry, ...prev]);
    
    // Track hydration and activity for achievements
    if (entry.waterToday) setHydrationDays((prev) => prev + 1);
    if (entry.activityToday) setActivityDays((prev) => prev + 1);
  };

  // ══════════════════════════════════════════════
  // COMMUNITY POSTS (persisted)
  // ══════════════════════════════════════════════
  const [posts, setPosts] = useLocalStorage("mamae_posts", PREGNANCY_DATA.initialPosts);
  const [userPostCount, setUserPostCount] = useLocalStorage("mamae_user_post_count", 0);

  const addPost = (text) => {
    const newPost = {
      id: Date.now(),
      author: user.name,
      user: `@${user.name.toLowerCase().replace(/\s+/g, "")}`,
      avatar: user.name[0].toUpperCase(),
      text,
      likes: 0,
      liked: false,
      comments: 0,
      tab: "feed",
    };
    setPosts((prev) => [newPost, ...prev]);
    setUserPostCount((prev) => prev + 1);
  };

  const toggleLikePost = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked };
        }
        return p;
      })
    );
  };

  // ══════════════════════════════════════════════
  // CALENDAR EVENTS (persisted & normalized)
  // ══════════════════════════════════════════════
  const [calendarEvents, setCalendarEvents] = useLocalStorage("mamae_calendar", PREGNANCY_DATA.initialCalendarEvents);

  const addCalendarEvent = (arg1, arg2) => {
    // If called with (day, event) -> legacy format
    if (typeof arg1 === "number" || (typeof arg1 === "string" && !isNaN(Number(arg1)) && arg2)) {
      const dayNum = Number(arg1);
      const id = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const newEv = {
        id,
        date: `2026-10-${String(dayNum).padStart(2, "0")}`,
        day: dayNum,
        title: arg2.title || "Novo Evento",
        type: arg2.type || "Consulta",
        time: arg2.time || "Dia todo",
        doctor: arg2.doctor || "",
        location: arg2.location || "",
        prepInstructions: arg2.prepInstructions || "",
        notes: arg2.notes || "",
        questions: arg2.questions || [],
        done: false,
        ...arg2,
      };
      setCalendarEvents((prev) => ({ ...prev, [id]: newEv }));
      return newEv;
    }
    
    // If called with full event object
    const eventObj = arg1 || {};
    const id = eventObj.id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newEv = {
      id,
      date: eventObj.date || todayStr(),
      day: eventObj.day || (eventObj.date ? parseInt(eventObj.date.split("-")[2], 10) : 1),
      title: eventObj.title || "Novo Evento",
      type: eventObj.type || "Consulta",
      time: eventObj.time || "Dia todo",
      doctor: eventObj.doctor || "",
      location: eventObj.location || "",
      prepInstructions: eventObj.prepInstructions || "",
      notes: eventObj.notes || "",
      questions: eventObj.questions || [],
      done: !!eventObj.done,
      ...eventObj,
    };
    setCalendarEvents((prev) => ({ ...prev, [id]: newEv }));
    return newEv;
  };

  const updateCalendarEvent = (id, updatedFields) => {
    setCalendarEvents((prev) => {
      const existing = prev[id] || {};
      return {
        ...prev,
        [id]: { ...existing, ...updatedFields },
      };
    });
  };

  const deleteCalendarEvent = (id) => {
    setCalendarEvents((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toggleCalendarEventDone = (id) => {
    setCalendarEvents((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      return {
        ...prev,
        [id]: { ...existing, done: !existing.done },
      };
    });
  };

  const addQuestionToEvent = (eventId, questionText) => {
    if (!questionText?.trim()) return;
    setCalendarEvents((prev) => {
      const existing = prev[eventId];
      if (!existing) return prev;
      const newQuestion = {
        id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        text: questionText.trim(),
        done: false,
      };
      const questions = [...(existing.questions || []), newQuestion];
      return {
        ...prev,
        [eventId]: { ...existing, questions },
      };
    });
  };

  const toggleQuestionDone = (eventId, questionId) => {
    setCalendarEvents((prev) => {
      const existing = prev[eventId];
      if (!existing) return prev;
      const questions = (existing.questions || []).map((q) =>
        q.id === questionId ? { ...q, done: !q.done } : q
      );
      return {
        ...prev,
        [eventId]: { ...existing, questions },
      };
    });
  };

  // ══════════════════════════════════════════════
  // WEIGHT HISTORY (Module 5, persisted & global)
  // ══════════════════════════════════════════════
  const [weightHistory, setWeightHistory] = useLocalStorage("mamae_weight_history", [
    { date: "16 Sem", value: 64.2, savedDate: "2026-06-22" },
    { date: "17 Sem", value: 64.8, savedDate: "2026-06-29" },
  ]);

  const addWeight = (value) => {
    const entry = { date: `Sem ${currentWeek}`, value: parseFloat(value), savedDate: todayStr() };
    setWeightHistory((prev) => [entry, ...prev]);
  };

  // ══════════════════════════════════════════════
  // KICK COUNTER SESSIONS (Module 5, persisted)
  // ══════════════════════════════════════════════
  const [kickSessions, setKickSessions] = useLocalStorage("mamae_kick_sessions", []);
  const [activeKickSession, setActiveKickSession] = useState(null); // { startTime, kicks: [] }

  const startKickSession = () => {
    setActiveKickSession({ startTime: Date.now(), kicks: [] });
  };

  const registerKick = () => {
    if (!activeKickSession) return;
    setActiveKickSession((prev) => ({
      ...prev,
      kicks: [...prev.kicks, Date.now()],
    }));
  };

  const endKickSession = () => {
    if (!activeKickSession) return;
    const session = {
      id: Date.now(),
      date: todayStr(),
      week: currentWeek,
      count: activeKickSession.kicks.length,
      startTime: activeKickSession.startTime,
      endTime: Date.now(),
      durationMs: Date.now() - activeKickSession.startTime,
    };
    setKickSessions((prev) => [session, ...prev]);
    setActiveKickSession(null);
    return session;
  };

  // ══════════════════════════════════════════════
  // CHAT HISTORY (Module 7, persisted)
  // ══════════════════════════════════════════════
  const [chatHistory, setChatHistory] = useLocalStorage("mamae_chat_history", []);
  const [chatMessagesSent, setChatMessagesSent] = useLocalStorage("mamae_chat_sent", 0);

  const addChatMessage = (msg) => {
    setChatHistory((prev) => [...prev, msg]);
    if (msg.sender === "user") {
      setChatMessagesSent((prev) => prev + 1);
    }
  };

  const clearChatHistory = () => {
    setChatHistory([]);
  };

  // ══════════════════════════════════════════════
  // NOTIFICATIONS (Module 3)
  // ══════════════════════════════════════════════
  const [notifications, setNotifications] = useLocalStorage("mamae_notifications", []);

  const addNotification = (type, title, body, targetScreen = null) => {
    const notif = {
      id: Date.now(),
      type, // "health", "diary", "calendar", "achievement", "week"
      title,
      body,
      read: false,
      date: todayStr(),
      targetScreen,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => setNotifications([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ══════════════════════════════════════════════
  // ACHIEVEMENTS (Module 6)
  // ══════════════════════════════════════════════
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage("mamae_achievements", []);
  const [newAchievement, setNewAchievement] = useState(null); // For toast animation

  const checkAchievements = useCallback(() => {
    const state = {
      diaryEntries,
      initialDiaryCount: PREGNANCY_DATA.initialDiaryEntries.length,
      diaryStreak,
      hydrationDays,
      activityDays,
      chatMessagesSent,
      userPostCount,
      kickSessions,
      currentWeek,
      moodHistory,
      weightHistory,
      calendarEvents,
      onboardingCompleted,
    };

    ACHIEVEMENTS.forEach((ach) => {
      if (!unlockedAchievements.includes(ach.id) && ach.check(state)) {
        setUnlockedAchievements((prev) => [...prev, ach.id]);
        setNewAchievement(ach);
        addNotification("achievement", ach.title, ach.description, "conquistas");
        // Auto-dismiss toast after 4 seconds
        setTimeout(() => setNewAchievement(null), 4000);
      }
    });
  }, [diaryEntries, diaryStreak, hydrationDays, activityDays, chatMessagesSent, userPostCount, kickSessions, currentWeek, moodHistory, weightHistory, calendarEvents, onboardingCompleted, unlockedAchievements]);

  // Run achievement checks whenever relevant state changes
  useEffect(() => {
    if (isLoggedIn) checkAchievements();
  }, [diaryEntries.length, chatMessagesSent, userPostCount, kickSessions.length, moodHistory.length, weightHistory.length, isLoggedIn]);

  // ══════════════════════════════════════════════
  // DAILY TIP (Module 7)
  // ══════════════════════════════════════════════
  const getDailyTip = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (24 * 60 * 60 * 1000));
    const quotes = PREGNANCY_DATA.quotes;
    return quotes[dayOfYear % quotes.length];
  };

  // ══════════════════════════════════════════════
  // AUTH ACTIONS
  // ══════════════════════════════════════════════
  const login = (email, password) => {
    setUser((prev) => ({ ...prev, email, name: prev.name === "Carla Silva" ? email.split("@")[0] : prev.name }));
    setIsLoggedIn(true);
    navigate("inicio");
  };

  const signup = (name, email, password) => {
    setUser((prev) => ({ ...prev, name, email }));
    setIsLoggedIn(true);
    navigate("formulario");
  };

  const saveOnboarding = (lmp, w, due, isFirst) => {
    setUser((prev) => ({
      ...prev,
      lmpDate: lmp,
      weeks: parseInt(w) || 17,
      dueDate: due,
      isFirstPregnancy: isFirst,
    }));
    setWeek(parseInt(w) || currentWeek);
    setOnboardingCompleted(true);
    addNotification("week", "Bem-vinda ao Mamãe+!", `Configuramos tudo para a semana ${w}. Aproveite sua jornada!`, "inicio");
    navigate("inicio");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setHistory([]);
    setCurrentScreen("login");
  };

  // ══════════════════════════════════════════════
  // PATIENTS & PATIENT DOCUMENTS (Medical Portal Module)
  // ══════════════════════════════════════════════
  const [patients, setPatients] = useState([
    {
      id: "carla",
      name: "Carla Silva",
      email: "carlasilva@gmail.com",
      weeks: 17,
      dueDate: "2026-12-15",
      isFirstPregnancy: true,
      latestWeight: 64.8,
      status: "regular",
      trimester: 2,
      progressPercent: 42,
      bloodType: "A+",
      allergies: "Nenhuma relatada",
      riskConditions: "Nenhuma (Baixo Risco)"
    },
    {
      id: "ana",
      name: "Ana Souza",
      email: "anasouza@hotmail.com",
      weeks: 28,
      dueDate: "2026-09-30",
      isFirstPregnancy: false,
      latestWeight: 73.2,
      status: "alerta",
      trimester: 3,
      progressPercent: 70,
      bloodType: "O-",
      allergies: "Penicilina",
      riskConditions: "Pressão Arterial Borderline (138/88 mmHg)"
    },
    {
      id: "mariana",
      name: "Mariana Costa",
      email: "mariana.costa@outlook.com",
      weeks: 12,
      dueDate: "2027-01-20",
      isFirstPregnancy: true,
      latestWeight: 58.0,
      status: "excelente",
      trimester: 1,
      progressPercent: 30,
      bloodType: "B+",
      allergies: "Ácaro, Pólen",
      riskConditions: "Nenhuma (Baixo Risco)"
    }
  ]);

  const [userDocuments, setUserDocuments] = useLocalStorage("mamae_documents", [
    {
      id: 1,
      patientEmail: "carlasilva@gmail.com",
      title: "Ultrassom Morfológico 1º Trimestre",
      type: "Ultrassonografia",
      date: "2026-04-15",
      status: "Analisado",
      fileUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60",
      feedback: "Imagens com excelente resolução. Batimentos fetais normais (148 bpm). Tamanho correspondente ao esperado.",
      drawer: "ultrassom"
    },
    {
      id: 2,
      patientEmail: "carlasilva@gmail.com",
      title: "Hemograma Completo & Glicemia",
      type: "Exame de Sangue",
      date: "2026-05-10",
      status: "Aguardando Leitura",
      fileUrl: "https://images.unsplash.com/photo-1579154204601-01588f351167?w=800&auto=format&fit=crop&q=60",
      feedback: "",
      drawer: "sangue"
    },
    {
      id: 3,
      patientEmail: "anasouza@hotmail.com",
      title: "Ultrassom Obstétrico 2º Trimestre",
      type: "Ultrassonografia",
      date: "2026-07-02",
      status: "Analisado",
      fileUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60",
      feedback: "Líquido amniótico no limite inferior. Recomendo aumentar hidratação oral imediatamente e repetir em 2 semanas.",
      drawer: "ultrassom"
    },
    {
      id: 4,
      patientEmail: "anasouza@hotmail.com",
      title: "Curva Glicêmica (TOTG 75g)",
      type: "Exame de Sangue",
      date: "2026-07-15",
      status: "Aguardando Leitura",
      fileUrl: "https://images.unsplash.com/photo-1579154204601-01588f351167?w=800&auto=format&fit=crop&q=60",
      feedback: "",
      drawer: "sangue"
    },
    {
      id: 5,
      patientEmail: "mariana.costa@outlook.com",
      title: "Beta HCG Quantitativo Inicial",
      type: "Exame de Sangue",
      date: "2026-02-18",
      status: "Analisado",
      fileUrl: "https://images.unsplash.com/photo-1579154204601-01588f351167?w=800&auto=format&fit=crop&q=60",
      feedback: "Níveis de HCG confirmam gestação viável inicial de cerca de 5-6 semanas. Parabéns!",
      drawer: "sangue"
    }
  ]);

  // Sync Carla Silva patient data with actual user state
  useEffect(() => {
    setPatients((prev) => 
      prev.map((p) => {
        if (p.id === "carla") {
          return {
            ...p,
            name: user.name,
            email: user.email,
            weeks: currentWeek,
            dueDate: user.dueDate,
            isFirstPregnancy: user.isFirstPregnancy,
            latestWeight: weightHistory?.[weightHistory.length - 1]?.value || 64.8,
            trimester: trimester,
            progressPercent: progressPercent
          };
        }
        return p;
      })
    );
  }, [user, currentWeek, weightHistory, trimester, progressPercent]);

  const uploadDocument = (title, type, fileUrl) => {
    const newDoc = {
      id: Date.now(),
      patientEmail: user.email,
      title,
      type,
      date: todayStr(),
      status: "Aguardando Leitura",
      fileUrl: fileUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60",
      feedback: ""
    };
    setUserDocuments((prev) => [newDoc, ...prev]);
    addNotification(
      "health",
      "Documento Enviado",
      `O documento "${title}" foi anexado com sucesso para análise do seu obstetra.`,
      "inicio"
    );
  };

  const addDocumentFeedback = (docId, feedbackText) => {
    setUserDocuments((prev) => 
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            feedback: feedbackText,
            status: "Analisado"
          };
        }
        return doc;
      })
    );
  };

  // ══════════════════════════════════════════════
  // Auto-restore session on mount
  // ══════════════════════════════════════════════
  useEffect(() => {
    if (isLoggedIn && currentScreen === "login") {
      setCurrentScreen("inicio");
    }
  }, []);

  // ══════════════════════════════════════════════
  // PROVIDER VALUE
  // ══════════════════════════════════════════════
  return (
    <AppContext.Provider
      value={{
        // Navigation
        currentScreen, history, navigate, goBack,
        // Auth
        isLoggedIn, user, setUser, login, signup, saveOnboarding, logout,
        // Gestational (Module 2)
        week, setWeek, currentWeek, daysRemaining, progressPercent, trimester,
        // Mood (Module 4)
        mood, setMood, moodHistory, getMoodStats,
        // Diary (Module 4)
        diaryEntries, addDiaryEntry, diaryStreak,
        // Community
        posts, addPost, toggleLikePost,
        // Calendar
        calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent, toggleCalendarEventDone, addQuestionToEvent, toggleQuestionDone,
        // Weight (Module 5)
        weightHistory, addWeight,
        // Kick Counter (Module 5)
        kickSessions, activeKickSession, startKickSession, registerKick, endKickSession,
        // Chat (Module 7)
        chatHistory, addChatMessage, clearChatHistory, chatMessagesSent, getDailyTip,
        // Notifications (Module 3)
        notifications, addNotification, markNotificationRead, markAllNotificationsRead, clearNotifications, unreadCount,
        // Achievements (Module 6)
        unlockedAchievements, newAchievement, ACHIEVEMENTS_LIST: ACHIEVEMENTS,
        // Onboarding
        onboardingCompleted,
        // Medical Portal & Document Library
        patients, userDocuments, setUserDocuments, uploadDocument, addDocumentFeedback,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
