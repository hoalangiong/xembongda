const STORAGE_KEY = "notify_subscriptions";

export interface Subscription {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  lastGoalsHome: number | null;
  lastGoalsAway: number | null;
  lastStatus: string;
}

export function getSubscriptions(): Subscription[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function subscribe(fixtureId: number, homeTeam: string, awayTeam: string) {
  const subs = getSubscriptions();
  if (subs.find((s) => s.fixtureId === fixtureId)) return;
  subs.push({
    fixtureId,
    homeTeam,
    awayTeam,
    lastGoalsHome: null,
    lastGoalsAway: null,
    lastStatus: "NS",
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
}

export function unsubscribe(fixtureId: number) {
  const subs = getSubscriptions().filter((s) => s.fixtureId !== fixtureId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
}

export function isSubscribed(fixtureId: number): boolean {
  return getSubscriptions().some((s) => s.fixtureId === fixtureId);
}

export function updateSubscription(fixtureId: number, goalsHome: number | null, goalsAway: number | null, status: string) {
  const subs = getSubscriptions();
  const sub = subs.find((s) => s.fixtureId === fixtureId);
  if (sub) {
    sub.lastGoalsHome = goalsHome;
    sub.lastGoalsAway = goalsAway;
    sub.lastStatus = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
  }
}

export function removeFinished() {
  const subs = getSubscriptions().filter((s) => s.lastStatus !== "FT");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
}

export async function requestPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function showNotification(title: string, body: string) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/bongda/favicon.ico",
      badge: "/bongda/favicon.ico",
    });
  }
}
