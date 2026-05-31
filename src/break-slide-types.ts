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
