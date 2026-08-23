/**
 * Utilitário para exportação de eventos para arquivos .ics (padrão RFC 5545)
 * Funciona nativamente em iOS, Android, Google Agenda, Outlook e Apple Calendar.
 */

function formatIcsDate(dateStr, timeStr) {
  // dateStr is 'YYYY-MM-DD'
  // timeStr can be '14:30' or 'Dia todo'
  const cleanDate = dateStr.replace(/-/g, "");
  if (!timeStr || timeStr === "Dia todo" || !timeStr.includes(":")) {
    return { isAllDay: true, value: cleanDate };
  }
  const [h, m] = timeStr.split(":");
  const padH = (h || "09").padStart(2, "0");
  const padM = (m || "00").padStart(2, "0");
  return { isAllDay: false, value: `${cleanDate}T${padH}${padM}00` };
}

function escapeIcsText(str) {
  if (!str) return "";
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function generateIcsString(events) {
  const eventList = Array.isArray(events) ? events : [events];
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  let ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mamãe Mais//Agenda Pré-Natal//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  eventList.forEach((ev, index) => {
    const uid = `mamaemais-${ev.id || index}-${Date.now()}@mamaemais.app`;
    const dtStart = formatIcsDate(ev.date, ev.time);
    
    // Description formatting
    let descLines = [];
    if (ev.type) descLines.push(`[Tipo: ${ev.type}]`);
    if (ev.doctor) descLines.push(`Profissional: ${ev.doctor}`);
    if (ev.prepInstructions) descLines.push(`Preparo: ${ev.prepInstructions}`);
    if (ev.notes) descLines.push(`Anotações: ${ev.notes}`);
    if (ev.questions && ev.questions.length > 0) {
      descLines.push("Dúvidas para a Consulta:");
      ev.questions.forEach((q, qi) => {
        descLines.push(`- ${q.text || q} ${q.done ? "(Respondida)" : ""}`);
      });
    }
    descLines.push("Criado pelo aplicativo Mamãe+");

    ics.push("BEGIN:VEVENT");
    ics.push(`UID:${uid}`);
    ics.push(`DTSTAMP:${now}`);
    if (dtStart.isAllDay) {
      ics.push(`DTSTART;VALUE=DATE:${dtStart.value}`);
    } else {
      ics.push(`DTSTART:${dtStart.value}`);
    }
    ics.push(`SUMMARY:${escapeIcsText(ev.title || "Compromisso Pré-Natal")}`);
    if (ev.location) {
      ics.push(`LOCATION:${escapeIcsText(ev.location)}`);
    }
    ics.push(`DESCRIPTION:${escapeIcsText(descLines.join("\n"))}`);
    ics.push("STATUS:CONFIRMED");
    ics.push("END:VEVENT");
  });

  ics.push("END:VCALENDAR");
  return ics.join("\r\n");
}

export function downloadIcsFile(events, filename = "agenda_mamae_mais.ics") {
  const icsData = generateIcsString(events);
  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
