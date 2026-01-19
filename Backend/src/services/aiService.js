import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing in backend/.env");
}

const ai = new GoogleGenAI({ apiKey });

function systemPrompt(language) {
  if (language === "es") {
    return `
Eres UpliftAI, un micro-asesor para estudiantes (académico + bienestar).
Reglas:
- Responde en español claro, amable y práctico.
- Sé breve (máx 8–10 líneas).
- Da pasos accionables.
- Haz 1 pregunta de seguimiento si falta contexto.
- Si hay crisis (autolesión/suicidio), recomienda ayuda inmediata y recursos de emergencia.
- No pidas datos personales.
`.trim();
  }

  return `
You are UpliftAI, a student micro-advisor (academics + wellness).
Rules:
- Reply in clear, friendly English.
- Be concise (max 8–10 lines).
- Give actionable steps.
- Ask 1 follow-up question if context is missing.
- If there is crisis content (self-harm/suicide), encourage immediate help and emergency resources.
- Do not ask for personal identifying info.
`.trim();
}

function fallbackReply(language) {
  return language === "es"
    ? "Ahora mismo el servicio de IA está ocupado. Un paso rápido: inhala 4s, mantén 2s, exhala 6s (3 veces). ¿Cuántos cursos llevas y cuántas horas trabajas a la semana?"
    : "The AI service is busy right now. Quick reset: inhale 4s, hold 2s, exhale 6s (3 times). How many classes are you taking and how many hours do you work per week?";
}

// Extract JSON even if the model adds extra text
function safeJsonParse(text) {
  if (!text) return null;
  const trimmed = text.trim();

  // Try direct parse first
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    // Try extracting first {...} block
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const maybe = trimmed.slice(start, end + 1);
      try {
        return JSON.parse(maybe);
      } catch (_) {
        return null;
      }
    }
    return null;
  }
}

export async function getAiReply({ message, language = "en" }) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const sys = systemPrompt(language);

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `${sys}\n\nStudent: ${message}\nUpliftAI:`,
    });

    const text = (response?.text || "").trim();
    return text || fallbackReply(language);
  } catch (err) {
    const status = err?.status || err?.response?.status;
    const msg = err?.message || "Unknown error";

    console.error("Gemini error status:", status);
    console.error("Gemini error message:", msg);

    if (status === 429) return fallbackReply(language);
    return fallbackReply(language);
  }
}

export async function getStudyPlan({
  language = "en",
  courses = [],
  workHoursPerWeek = 0,
  commuteMinutesPerDay = 0,
  daysPerWeek = 7,
  focus = "",
}) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const langLabel = language === "es" ? "Spanish" : "English";

  const prompt = `
You are UpliftAI, a student success micro-advisor.
Return ONLY valid JSON. No markdown. No extra text.

Language: ${langLabel}

Student context:
- Courses: ${courses.join(", ")}
- Work hours/week: ${workHoursPerWeek}
- Commute minutes/day: ${commuteMinutesPerDay}
- Days per week to plan: ${daysPerWeek}
- Focus / upcoming: ${focus}

Goal:
Create a realistic weekly study plan with time blocks and coping/wellness tips.

Output JSON schema exactly:
{
  "overview": "string",
  "weeklyPlan": [
    {
      "day": "Monday",
      "blocks": [
        { "time": "HH:MM-HH:MM", "task": "string", "durationMinutes": 0, "notes": "string" }
      ]
    }
  ],
  "tips": ["string", "string", "string"],
  "copingToolbox": ["string", "string", "string"]
}

Rules:
- Use 2 to 5 blocks per day.
- Distribute study across courses.
- Include breaks and 1 wellness action daily.
- Keep it supportive and realistic.
`.trim();

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const text = (response?.text || "").trim();
    const parsed = safeJsonParse(text);

    if (parsed) return parsed;

    // If still not JSON, fallback into a displayable structure
    return {
      overview: language === "es" ? "Plan generado (texto)." : "Plan generated (text).",
      weeklyPlan: [
        {
          day: language === "es" ? "Semana" : "Week",
          blocks: [
            {
              time: "—",
              task: text.slice(0, 3000),
              durationMinutes: 0,
              notes:
                language === "es"
                  ? "La respuesta no vino en JSON; se mostró como texto."
                  : "The model returned non-JSON; shown as text.",
            },
          ],
        },
      ],
      tips: [],
      copingToolbox: [],
    };
  } catch (err) {
    const status = err?.status || err?.response?.status;
    const msg = err?.message || "Unknown error";

    console.error("Gemini studyPlan error status:", status);
    console.error("Gemini studyPlan error message:", msg);

    return {
      overview: language === "es" ? "Error al generar el plan." : "Error generating plan.",
      weeklyPlan: [],
      tips: [],
      copingToolbox: [],
    };
  }
}
