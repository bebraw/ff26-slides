import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const targetPath = resolve(".generated/break-slides.json");
const localEnvPath = resolve(".dev.vars");
const fallbackSponsors = [
  { name: "Ohjelmistofriikit", image: "/img/ohjelmistofriikit-black.svg", size: "tech" },
  { name: "Nitor", image: "/img/nitor.svg", size: "tech" },
  { name: "Alma Media", image: "/img/alma.svg", size: "brand" },
];
const scheduleQuery = `
query PageQuery($conferenceId: ID!) {
  conference(id: $conferenceId) {
    schedules {
      day
      intervals {
        begin
        end
        title
        sessions {
          type
          title
          speakers {
            name
            image {
              url
            }
          }
          sessions {
            type
            title
            speakers {
              name
              image {
                url
              }
            }
          }
        }
      }
    }
  }
}
`;

await loadLocalEnv();

const apiUrl = requireEnv("FF26_GRAPHQL_URL");
const apiToken = requireEnv("FF26_GRAPHQL_TOKEN");
const conferenceId = requireEnv("FF26_CONFERENCE_ID");

const data = await fetchSchedule(apiUrl, apiToken, conferenceId);
const breakSlides = normalizeBreakSlides(data);
const nextSource = `${JSON.stringify({ breakSlides, sponsors: fallbackSponsors }, null, 2)}\n`;

await mkdir(resolve(".generated"), { recursive: true });
await writeFile(targetPath, nextSource, "utf8");

console.log(`Synced ${breakSlides.length} break slides to ${targetPath}`);

async function loadLocalEnv() {
  let file;

  try {
    file = await readFile(localEnvPath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return;
    }

    throw error;
  }

  for (const line of file.split(/\r?\n/u)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const name = trimmed.slice(0, separatorIndex).trim();
    const value = unquoteEnvValue(trimmed.slice(separatorIndex + 1).trim());

    if (name && process.env[name] === undefined) {
      process.env[name] = value;
    }
  }
}

function unquoteEnvValue(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  return value;
}

function requireEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }

  return value;
}

async function fetchSchedule(apiUrl, apiToken, conferenceId) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      TOKEN: apiToken,
    },
    body: JSON.stringify({
      query: scheduleQuery,
      variables: { conferenceId },
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed with ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();

  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    const messages = payload.errors
      .map((error) => error.message)
      .filter(Boolean)
      .join("; ");
    throw new Error(`GraphQL request returned errors: ${messages || "unknown error"}`);
  }

  const schedules = payload?.data?.conference?.schedules;

  if (!Array.isArray(schedules)) {
    throw new Error("GraphQL response did not contain conference.schedules");
  }

  return schedules;
}

function normalizeBreakSlides(schedules) {
  return schedules.flatMap((schedule) => {
    const intervals = ensureArray(schedule.intervals).toSorted(compareIntervals);
    const day = formatDay(schedule.day);

    return intervals.map((interval) => normalizeInterval(day, interval)).filter((slide) => slide.session);
  });
}

function normalizeInterval(day, interval) {
  const talks = normalizeTalks(interval);
  const session = normalizeIntervalTitle(interval, talks);
  const slide = {
    day,
    time: formatTimeRange(interval.begin, interval.end),
    session,
  };

  if (talks.length > 0) {
    slide.talks = talks;
  }

  return slide;
}

function normalizeIntervalTitle(interval, talks) {
  const title = cleanText(interval.title);

  if (title) {
    return title;
  }

  if (talks.length > 0) {
    return "";
  }

  return [
    ...new Set(
      flattenSessions(interval)
        .map((session) => cleanText(session.title))
        .filter(Boolean),
    ),
  ].join(" / ");
}

function normalizeTalks(interval) {
  return flattenSessions(interval)
    .map(normalizeTalk)
    .filter((talk) => talk.title && talk.speakers.length > 0);
}

function flattenSessions(interval) {
  return ensureArray(interval.sessions).flatMap((session) => {
    const nested = ensureArray(session.sessions);

    return nested.length > 0 ? nested : [session];
  });
}

function normalizeTalk(session) {
  return {
    title: cleanText(session.title),
    speakers: ensureArray(session.speakers)
      .map((speaker) => ({
        name: cleanText(speaker.name),
        image: cleanText(speaker.image?.url),
      }))
      .filter((speaker) => speaker.name && speaker.image),
  };
}

function formatDay(value) {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.valueOf())) {
    return cleanText(value);
  }

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(date);
}

function formatTimeRange(begin, end) {
  const start = formatTime(begin);
  const stop = formatTime(end);

  return stop ? `${start}-${stop}` : start;
}

function formatTime(value) {
  const time = cleanText(value);
  const timeMatch = /^(\d{1,2}):(\d{2})/u.exec(time);

  if (timeMatch) {
    const hours = Number(timeMatch[1]);
    const minutes = timeMatch[2];

    return `${String((hours + 3) % 24).padStart(2, "0")}:${minutes}`;
  }

  const date = new Date(time);

  if (!Number.isNaN(date.valueOf())) {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: "Europe/Helsinki",
    }).format(date);
  }

  return time.slice(0, 5);
}

function compareIntervals(left, right) {
  return cleanText(left.begin).localeCompare(cleanText(right.begin));
}

function cleanText(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/gu, " ") : "";
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}
