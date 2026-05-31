export type Speaker = {
  name: string;
  image: string;
};

export type Talk = {
  title: string;
  speakers: Speaker[];
};

export type BreakSlide = {
  day: string;
  label?: string;
  time: string;
  session: string;
  talks?: Talk[];
};

export type Sponsor = {
  name: string;
  image: string;
  size: "tech" | "brand";
};

// Stryker disable all: Curated schedule literals are content, while the rendering paths remain mutation-tested.
export const breakSlides: BreakSlide[] = [
  {
    day: "Monday, 8 June",
    time: "09:00-10:30",
    session: "Designing futures",
    talks: [
      talk("We Don't Have an Idea Problem. We Have a Permission Problem.", speaker("Pasi Sillanpää", "/img/pasi.webp")),
      talk("Endineering", speaker("Joe Macleod", "/img/joe.webp")),
    ],
  },
  {
    day: "Monday, 8 June",
    time: "11:00-12:30",
    session: "Future of work",
    talks: [
      talk("Not Loud, Still Powerful - Taking Agency Without Becoming Someone Else", speaker("Laura Snellman-Junna", "/img/laura2.webp")),
      talk(
        "Designing Leadership Growth in Tech Teams (When Developers Just Want to Code)",
        speaker("Anastasiia Zvenigorodskaia", "/img/anastasiia.webp"),
      ),
    ],
  },
  {
    day: "Monday, 8 June",
    label: "Up next",
    time: "12:30-13:30",
    session: "Lunch",
  },
  {
    day: "Monday, 8 June",
    time: "13:30-15:00",
    session: "Resilience",
    talks: [
      talk("This is not the tech I signed up for! - An approach to permacomputing", speaker("Darío Gutiérrez Mori", "/img/dario.jpg")),
      talk("Building Resilience: Origins", speaker("Georgios Diamantopoulos", "/img/georgios.webp")),
    ],
  },
  {
    day: "Monday, 8 June",
    time: "15:30-17:15",
    session: "Accessibility",
    talks: [
      talk("Accessibility Adventures - The Lost Secrets of Forced Colors Mode", speaker("Daniel Yuschick", "/img/daniel.webp")),
      talk("The Cake Is a Lie... And So Is Your Login's Accessibility", speaker("Ramona Schwering", "/img/ramona.webp")),
      talk("Frontend after AI: The new UX", speaker("Tejas Kumar", "/img/tejas.webp")),
    ],
  },
  {
    day: "Monday, 8 June",
    label: "Up next",
    time: "17:15-17:20",
    session: "Ending of the day",
  },
  {
    day: "Tuesday, 9 June",
    time: "09:00-10:30",
    session: "Simplicity",
    talks: [
      talk("Modern UI Patterns", speaker("Una Kravets", "/img/una.webp")),
      talk(
        "A Canon for the Vanilla Web - How pairing modern platform features with a small set of conventions lets us build beautiful web UI in half the tokens",
        speaker("Tony Ennis", "/img/tony-ennis.webp"),
      ),
    ],
  },
  {
    day: "Tuesday, 9 June",
    time: "11:00-12:30",
    session: "Architecture",
    talks: [
      talk("Bringing a bit of architecture in your frontend application", speaker("Matthew Mamonov", "/img/matthew-m.webp")),
      talk("AI-first frontend architecture", speaker("Rashmi Suralkar", "/img/rashmi.webp")),
    ],
  },
  {
    day: "Tuesday, 9 June",
    label: "Up next",
    time: "12:30-13:30",
    session: "Lunch",
  },
  {
    day: "Tuesday, 9 June",
    time: "13:30-15:00",
    session: "Agentic development",
    talks: [
      talk("The AI Velocity Trap: Shipping Faster Without Breaking More", speaker("Ohans Emmanuel", "/img/ohans.webp")),
      talk("Building My Own Coding Agent", speaker("Christoffer Niska", "/img/crisu.webp")),
    ],
  },
  {
    day: "Tuesday, 9 June",
    time: "15:30-17:00",
    session: "Agentic use cases",
    talks: [
      talk("Mysterious talk", speaker("Alex Booker", "/img/alex-booker.webp"), speaker("Tony Kovanen", "/img/tony-kovanen.webp")),
      talk("The Headless Web", speaker("Rachel-Lee Nabors", "/img/rachel.webp")),
    ],
  },
  {
    day: "Tuesday, 9 June",
    label: "Up next",
    time: "17:00-17:15",
    session: "Ending of the day",
  },
];

export const sponsors: Sponsor[] = [
  { name: "Ohjelmistofriikit", image: "/img/ohjelmistofriikit-black.svg", size: "tech" },
  { name: "Nitor", image: "/img/nitor.svg", size: "tech" },
  { name: "Alma Media", image: "/img/alma.svg", size: "brand" },
];
// Stryker restore all

function talk(title: string, ...speakers: Speaker[]): Talk {
  return { title, speakers };
}

function speaker(name: string, image: string): Speaker {
  return { name, image };
}
