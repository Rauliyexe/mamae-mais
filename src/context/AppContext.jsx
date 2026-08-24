import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PREGNANCY_DATA } from "../data/mockData";
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
  const [userRole, setUserRole] = useLocalStorage("mamae_user_role", "mother"); // "mother" | "doctor"
  const [doctorUser, setDoctorUser] = useLocalStorage("mamae_doctor_user", {
    name: "Dr. Leonardo Pinto",
    crm: "184920",
    uf: "SP",
    specialty: "Ginecologia & Obstetrícia",
    clinic: "Hospital e Maternidade Santa Clara",
  });
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
  const [posts, setPosts] = useLocalStorage("mamae_posts", PREGNANCY_DATA.initialPosts || []);
  const [userPostCount, setUserPostCount] = useLocalStorage("mamae_user_post_count", 0);

  const addPost = (postData) => {
    // If called with string for backward-compatibility
    const isString = typeof postData === "string";
    const text = isString ? postData : postData.text;
    const category = isString ? "geral" : (postData.category || "geral");
    const categoryLabel = isString ? "Dúvidas Gerais" : (postData.categoryLabel || "Dúvidas Gerais");
    const isAnonymous = !isString && !!postData.isAnonymous;
    const tags = !isString && Array.isArray(postData.tags) ? postData.tags : ["#Comunidade"];

    const isDoctor = userRole === "doctor";
    const authorName = isAnonymous ? "Mamãe Anônima" : (isDoctor ? (doctorUser.name || "Dr(a). Obstetra") : (user.name || "Mamãe"));
    const userHandle = isAnonymous ? "@anonima" : `@${authorName.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    const avatar = isAnonymous ? "🔒" : (authorName[0]?.toUpperCase() || "M");
    const badge = isAnonymous 
      ? `Desabafo Acolhido · ${currentWeek}ª sem`
      : isDoctor 
        ? `Médico(a) · CRM ${doctorUser.crm || "184920"}`
        : `Mamãe · ${currentWeek}ª sem`;

    const newPost = {
      id: `post_${Date.now()}`,
      author: authorName,
      user: userHandle,
      avatar,
      badge,
      isDoctor,
      isAnonymous,
      timeAgo: "agora mesmo",
      category,
      categoryLabel,
      tags,
      text,
      likes: 0,
      liked: false,
      saved: false,
      comments: [],
      tab: "feed",
    };

    setPosts((prev) => [newPost, ...(Array.isArray(prev) ? prev : [])]);
    setUserPostCount((prev) => prev + 1);
  };

  const toggleLikePost = (postId) => {
    setPosts((prev) =>
      (Array.isArray(prev) ? prev : []).map((p) => {
        if (p.id === postId) {
          const wasLiked = !!p.liked;
          const currentLikes = typeof p.likes === "number" ? p.likes : 0;
          return { ...p, likes: wasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1, liked: !wasLiked };
        }
        return p;
      })
    );
  };

  const toggleSavePost = (postId) => {
    setPosts((prev) =>
      (Array.isArray(prev) ? prev : []).map((p) => {
        if (p.id === postId) {
          return { ...p, saved: !p.saved };
        }
        return p;
      })
    );
  };

  const addCommentToPost = (postId, commentText) => {
    if (!commentText || !commentText.trim()) return;
    const isDoctor = userRole === "doctor";
    const authorName = isDoctor ? (doctorUser.name || "Dr(a). Obstetra") : (user.name || "Mamãe");
    const badge = isDoctor ? `Médico(a) CRM ${doctorUser.crm || "184920"}` : `Mamãe · ${currentWeek}ª sem`;

    const newComment = {
      id: `c_${Date.now()}`,
      author: authorName,
      badge,
      isDoctor,
      timeAgo: "agora mesmo",
      text: commentText.trim(),
      likes: 0,
    };

    setPosts((prev) =>
      (Array.isArray(prev) ? prev : []).map((p) => {
        if (p.id === postId) {
          const currentComments = Array.isArray(p.comments) ? p.comments : [];
          return {
            ...p,
            comments: [...currentComments, newComment],
          };
        }
        return p;
      })
    );
  };

  const deletePost = (postId) => {
    setPosts((prev) => (Array.isArray(prev) ? prev.filter((p) => p.id !== postId) : []));
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
    setUserRole("mother");
    setUser((prev) => ({ ...prev, email, name: prev.name === "Carla Silva" ? email.split("@")[0] : prev.name }));
    setIsLoggedIn(true);
    navigate("inicio");
  };

  const loginDoctor = ({ crm, uf, name, specialty, clinic }) => {
    setUserRole("doctor");
    setDoctorUser((prev) => ({
      ...prev,
      crm: crm || prev.crm,
      uf: uf || prev.uf,
      name: name || prev.name,
      specialty: specialty || prev.specialty,
      clinic: clinic || prev.clinic,
    }));
    setIsLoggedIn(true);
    navigate("portalmedico");
  };

  const signupDoctor = ({ name, crm, uf, specialty, clinic, password }) => {
    setUserRole("doctor");
    setDoctorUser({
      name: name || `Dr(a). CRM ${crm}`,
      crm: crm || "184920",
      uf: uf || "SP",
      specialty: specialty || "Ginecologia & Obstetrícia",
      clinic: clinic || "Consultório Particular",
    });
    setIsLoggedIn(true);
    navigate("portalmedico");
  };

  const signup = (name, email, password) => {
    setUserRole("mother");
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
  // ══════════════════════════════════════════════
  // PATIENTS & PATIENT DOCUMENTS (Multi-Specialty Presenz Platform)
  // ══════════════════════════════════════════════
  const [patients, setPatients] = useState([
    {
      id: "carla",
      name: "Carla Silva",
      email: "carlasilva@gmail.com",
      specialty: "obstetricia",
      specialtyLabel: "Obstetrícia (Mamãe+)",
      age: 29,
      gender: "F",
      weeks: 17,
      dueDate: "2026-12-15",
      isFirstPregnancy: true,
      latestWeight: 64.8,
      status: "regular",
      trimester: 2,
      progressPercent: 42,
      bloodType: "A+",
      allergies: "Nenhuma relatada",
      riskConditions: "Pré-natal Habitual (Baixo Risco)",
      vitals: { hr: 78, fhr: 144, bp: "118/76", spo2: "99%", glucose: "88 mg/dL", temp: "36.5°C" },
      nfcTag: "NFC-MAMAE-0941",
    },
    {
      id: "ana",
      name: "Ana Souza",
      email: "anasouza@hotmail.com",
      specialty: "obstetricia",
      specialtyLabel: "Obstetrícia (Mamãe+)",
      age: 33,
      gender: "F",
      weeks: 28,
      dueDate: "2026-09-30",
      isFirstPregnancy: false,
      latestWeight: 73.2,
      status: "alerta",
      trimester: 3,
      progressPercent: 70,
      bloodType: "O-",
      allergies: "Penicilina",
      riskConditions: "Pressão Arterial Borderline (138/88 mmHg)",
      vitals: { hr: 84, fhr: 148, bp: "138/88", spo2: "98%", glucose: "94 mg/dL", temp: "36.6°C" },
      nfcTag: "NFC-MAMAE-1822",
    },
    {
      id: "carlos",
      name: "Carlos Eduardo Ramos",
      email: "carlos.ramos@gmail.com",
      specialty: "cardiologia",
      specialtyLabel: "Cardiologia & Telemetria",
      age: 58,
      gender: "M",
      status: "alerta",
      bloodType: "O+",
      allergies: "Dipirona",
      riskConditions: "Hipertensão Arterial Sistêmica & Arritmia Sinusal",
      vitals: { hr: 86, bp: "144/92", spo2: "97%", glucose: "102 mg/dL", temp: "36.4°C", hrv: "42 ms" },
      nfcTag: "NFC-CARDIO-8812",
    },
    {
      id: "juliana",
      name: "Juliana Mendes",
      email: "juliana.mendes@gmail.com",
      specialty: "endocrinologia",
      specialtyLabel: "Endocrinologia & Diabetes",
      age: 34,
      gender: "F",
      status: "regular",
      bloodType: "B+",
      allergies: "Sulfa",
      riskConditions: "Diabetes Mellitus Tipo 1 (Sensor CGM Ativo)",
      vitals: { hr: 72, bp: "116/74", spo2: "99%", glucose: "114 mg/dL", temp: "36.5°C", hba1c: "6.4%" },
      nfcTag: "NFC-ENDO-3019",
    },
    {
      id: "lucas",
      name: "Lucas Gabriel (Bebê)",
      email: "pais.lucas@gmail.com",
      specialty: "pediatria",
      specialtyLabel: "Pediatria & Puericultura",
      age: "8 meses",
      gender: "M",
      status: "excelente",
      bloodType: "A+",
      allergies: "Nenhuma conhecida",
      riskConditions: "Puericultura de Rotina · Marcos de Desenvolvimento OK",
      vitals: { hr: 115, bp: "90/60", spo2: "99%", temp: "36.7°C", weight: "8.9 kg", height: "71 cm" },
      nfcTag: "NFC-PED-5541",
    },
    {
      id: "helena",
      name: "Dona Helena Silveira",
      email: "helena.silveira@gmail.com",
      specialty: "clinica",
      specialtyLabel: "Clínica Médica & Geriatria",
      age: 68,
      gender: "F",
      status: "regular",
      bloodType: "AB+",
      allergies: "Iodo, Contraste Radiológico",
      riskConditions: "Dislipidemia, Osteopenia & Acompanhamento Geriátrico",
      vitals: { hr: 70, bp: "126/80", spo2: "98%", glucose: "96 mg/dL", temp: "36.3°C" },
      nfcTag: "NFC-GERIAT-7023",
    }
  ]);

  const [userDocuments, setUserDocuments] = useLocalStorage("mamae_documents", [
    {
      id: 1,
      patientEmail: "carlasilva@gmail.com",
      title: "Ultrassom Morfológico 1º Trimestre",
      type: "Ultrassonografia",
      specialty: "obstetricia",
      date: "2026-04-15",
      status: "Analisado",
      fileUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60",
      feedback: "Imagens com excelente resolução. Batimentos fetais normais (148 bpm). Tamanho correspondente ao esperado.",
      drawer: "ultrassom"
    },
    {
      id: 2,
      patientEmail: "carlos.ramos@gmail.com",
      title: "Holter 24 Horas & Eletrocardiograma Digital",
      type: "Eletrocardiografia",
      specialty: "cardiologia",
      date: "2026-08-10",
      status: "Analisado",
      fileUrl: "https://images.unsplash.com/photo-1579154204601-01588f351167?w=800&auto=format&fit=crop&q=60",
      feedback: "Ritmo sinusal basal com extrassístoles supraventriculares isoladas raras. Sem pausas significativas.",
      drawer: "cardio"
    },
    {
      id: 3,
      patientEmail: "juliana.mendes@gmail.com",
      title: "Relatório de Monitoramento Contínuo de Glicose (CGM)",
      type: "Bio-Telemetria",
      specialty: "endocrinologia",
      date: "2026-08-18",
      status: "Analisado",
      fileUrl: "https://images.unsplash.com/photo-1579154204601-01588f351167?w=800&auto=format&fit=crop&q=60",
      feedback: "Tempo no Alvo (TIR 70-180 mg/dL): 84%. Excelente controle glicêmico com baixa variabilidade.",
      drawer: "glicemia"
    },
    {
      id: 4,
      patientEmail: "lucas.gabriel@gmail.com",
      title: "Caderneta de Vacinação & Curva de Crescimento Pediátrica",
      type: "Puericultura",
      specialty: "pediatria",
      date: "2026-08-01",
      status: "Analisado",
      fileUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60",
      feedback: "Percentil peso/idade: P50 (ideal). Esquema vacinal completo para 8 meses de idade.",
      drawer: "pediatria"
    },
    {
      id: 5,
      patientEmail: "anasouza@hotmail.com",
      title: "Ultrassom Obstétrico 2º Trimestre & Doppler",
      type: "Ultrassonografia",
      specialty: "obstetricia",
      date: "2026-07-02",
      status: "Analisado",
      fileUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60",
      feedback: "Líquido amniótico no limite inferior. Recomendo aumentar hidratação oral imediatamente e repetir em 2 semanas.",
      drawer: "ultrassom"
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
      if (userRole === "doctor") {
        setCurrentScreen("portalmedico");
      } else {
        setCurrentScreen("inicio");
      }
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
        // Auth & Role
        isLoggedIn, userRole, user, setUser, doctorUser, setDoctorUser, login, loginDoctor, signupDoctor, signup, saveOnboarding, logout,
        // Gestational (Module 2)
        week, setWeek, currentWeek, daysRemaining, progressPercent, trimester,
        // Mood (Module 4)
        mood, setMood, moodHistory, getMoodStats,
        // Diary (Module 4)
        diaryEntries, addDiaryEntry, diaryStreak,
        // Community
        posts, addPost, toggleLikePost, toggleSavePost, addCommentToPost, deletePost,
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
