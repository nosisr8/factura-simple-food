import type { OpeningHour } from "@/modules/opening-hours/domain/opening-hour";

const weekdayToNumber: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function toMinutes(hhmm: string) {
  const [hh, mm] = hhmm.split(":").map((n) => Number(n));
  return hh * 60 + mm;
}

function getZonedNow(timeZone: string): { dayOfWeek: number; minutes: number } {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = dtf.formatToParts(new Date());
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  const dayOfWeek = weekdayToNumber[weekday] ?? 0;
  return { dayOfWeek, minutes: Number(hour) * 60 + Number(minute) };
}

function isOpenInRange(now: number, opensAt: number, closesAt: number) {
  if (opensAt === closesAt) return false;
  // Normal
  if (opensAt < closesAt) return now >= opensAt && now < closesAt;
  // Cruza medianoche (ej 20:00-02:00)
  return now >= opensAt || now < closesAt;
}

export function computeOpenStatus(input: {
  timeZone: string;
  hours: OpeningHour[];
}): { isOpen: boolean; label: "Abierto" | "Cerrado" } {
  const { timeZone, hours } = input;
  const now = getZonedNow(timeZone);

  const today = hours.find((h) => h.dayOfWeek === now.dayOfWeek) ?? null;
  const yesterday = hours.find((h) => h.dayOfWeek === ((now.dayOfWeek + 6) % 7)) ?? null;

  const check = (h: OpeningHour | null) => {
    if (!h || h.isClosed) return false;
    const o = toMinutes(h.opensAt);
    const c = toMinutes(h.closesAt);
    return isOpenInRange(now.minutes, o, c);
  };

  const openToday = check(today);
  if (openToday) return { isOpen: true, label: "Abierto" };

  // Si ayer cruzaba medianoche y ahora está antes del cierre, se considera abierto
  if (yesterday && !yesterday.isClosed) {
    const o = toMinutes(yesterday.opensAt);
    const c = toMinutes(yesterday.closesAt);
    const crosses = o > c;
    if (crosses && now.minutes < c) return { isOpen: true, label: "Abierto" };
  }

  return { isOpen: false, label: "Cerrado" };
}

