// Frontend/src/utils/i18n.js

const translations = {
  en: {
    title: "UpliftAI — Student Micro-Advisor",

    // Student header
    studentTitle: "Student Portal",
    studentSubtitle: "Chat, schedules, wellness, study plans, reminders",
    switchToSpanish: "Switch to Spanish",
    switchToEnglish: "Switch to English",

    // Chat
    chatTitle: "How are you feeling today?",
    chatSubtitle:
      "Tell me what’s on your mind — classes, finals, stress, time management — I’ll help you plan and stay on track.",
    chatPlaceholder:
      "Help me plan today’s schedule.",

    // Schedule
    scheduleTitle: "Academic Schedule Generator",
    scheduleHint:
      "Enter your workload and commute. We’ll generate a simple weekly plan you can follow.",
    courses: "Courses",
    workHours: "Work hours/week",
    commute: "Commute (minutes)",
    generate: "Generate Schedule",
    weeklyPlan: "Weekly Plan",

    // Wellness
    wellness: "Wellness Toolbox",
    wellnessHint:
      "Quick reset ideas you can use anytime. Add your own tips",
    addYourTip: "Add your own tip",
    add: "Add",
    addTip: "Add",
  },

  es: {
    title: "UpliftAI — Asesor Microestudiantil",

    // Student header
    studentTitle: "Portal del Estudiante",
    studentSubtitle: "Chat, horarios, bienestar, planes de estudio, recordatorios",
    switchToSpanish: "Cambiar a Español",
    switchToEnglish: "Cambiar a Inglés",

    // Chat
    chatTitle: "¿Cómo te sientes hoy?",
    chatSubtitle:
      "Cuéntame qué te preocupa — clases, finales, estrés u organización — te ayudaré a planear tu día.",
    chatPlaceholder:
      "Ayúdame a planificar el horario de hoy.",

    // Schedule
    scheduleTitle: "Generador de Horario Académico",
    scheduleHint:
      "Ingresa tu carga de trabajo y traslado. Generaremos un plan semanal simple.",
    courses: "Cursos",
    workHours: "Horas de trabajo/semana",
    commute: "Traslado (minutos)",
    generate: "Generar Horario",
    weeklyPlan: "Plan Semanal",

    // Wellness
    wellness: "Caja de Bienestar",
    wellnessHint:
      "Ideas rápidas para reiniciarte. Agrega tus propios tips.",
    addYourTip: "Agrega tu tip",
    add: "Agregar",
    addTip: "Agregar",
  },
};

// ✅ named export (so import { t } ... works)
export function t(key, lang = "en") {
  const table = translations[lang] || translations.en;
  return table[key] || translations.en[key] || key;
}

// ✅ optional default export (so import t from ... also works)
export default t;