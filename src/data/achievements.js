/**
 * Mamãe+ Achievement Definitions
 * Each achievement has a check function that receives the full app state.
 * Icon names correspond to Lucide Icons.
 */
export const ACHIEVEMENTS = [
  {
    id: "first_diary",
    title: "Primeiro Registro",
    description: "Complete seu primeiro registro no diário",
    icon: "BookOpen",
    check: (s) => s.diaryEntries.length > (s.initialDiaryCount || 2),
  },
  {
    id: "week_streak",
    title: "Semana Completa",
    description: "Registre seu diário por 7 dias consecutivos",
    icon: "Award",
    check: (s) => s.diaryStreak >= 7,
  },
  {
    id: "hydration_5",
    title: "Hidratação Total",
    description: "Marque 'bebeu água' no diário por 5 dias",
    icon: "Droplet",
    check: (s) => s.hydrationDays >= 5,
  },
  {
    id: "active_mama",
    title: "Mamãe Ativa",
    description: "Registre atividade física 3 vezes",
    icon: "Heart",
    check: (s) => s.activityDays >= 3,
  },
  {
    id: "chatty",
    title: "Conversadora",
    description: "Envie 10 mensagens para a Nina IA",
    icon: "MessageSquare",
    check: (s) => s.chatMessagesSent >= 10,
  },
  {
    id: "community_3",
    title: "Voz da Comunidade",
    description: "Publique 3 posts no fórum",
    icon: "Users",
    check: (s) => s.userPostCount >= 3,
  },
  {
    id: "kick_sessions_5",
    title: "Monitora de Chutes",
    description: "Complete 5 sessões do contador de chutes",
    icon: "Activity",
    check: (s) => s.kickSessions.length >= 5,
  },
  {
    id: "halfway",
    title: "Metade do Caminho!",
    description: "Atinja a semana 20 da gestação",
    icon: "Sparkles",
    check: (s) => s.currentWeek >= 20,
  },
  {
    id: "mood_tracker_7",
    title: "Autoconhecimento",
    description: "Registre seu humor por 7 dias diferentes",
    icon: "Smile",
    check: (s) => s.moodHistory.length >= 7,
  },
  {
    id: "weight_tracker_3",
    title: "Balança em Dia",
    description: "Registre seu peso 3 vezes",
    icon: "Scale",
    check: (s) => s.weightHistory.length >= 3,
  },
  {
    id: "calendar_event_3",
    title: "Organizada",
    description: "Agende 3 compromissos no calendário",
    icon: "Calendar",
    check: (s) => Object.keys(s.calendarEvents).length >= 3,
  },
  {
    id: "full_profile",
    title: "Perfil Completo",
    description: "Complete o formulário de onboarding",
    icon: "CheckCircle2",
    check: (s) => s.onboardingCompleted === true,
  },
];
