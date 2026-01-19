const translations = {
  en: {
    title: "UpliftAI — Student Micro-Advisor",
    chat: "AI Micro-Advisor",
    schedule: "Study Schedule Generator",
    wellness: "Wellness Toolbox",
    courses: "Number of courses",
    workHours: "Work hours per week",
    commute: "Daily commute (minutes)",
    generate: "Generate Schedule",
    addTip: "Add"
  },
  es: {
    title: "UpliftAI — Asesor Microestudiantil",
    chat: "Asesor AI",
    schedule: "Generador de Horario de Estudio",
    wellness: "Caja de Bienestar",
    courses: "Número de cursos",
    workHours: "Horas de trabajo por semana",
    commute: "Desplazamiento diario (minutos)",
    generate: "Generar Horario",
    addTip: "Agregar"
  }
};

export default function t(key, lang = "en") {
  return translations[lang][key] || key;
}
