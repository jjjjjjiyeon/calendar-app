// src/hooks/useCalendarStore.js
import { create } from "zustand";
import calendarApi from "../api/calendarApi";

const SELECTED_KEY = "selectedCalendars";
const DEFAULT_COLOR = "#A5B4FC"; // 파스텔 보라 기본

// ✅ calendarId가 객체(populate)로 와도 항상 "문자열 ID"로 정규화
const normalizeCalId = (v) =>
  v && typeof v === "object" ? String(v._id || v.id) : String(v || "");

export const useCalendarStore = create((set, get) => ({
  // state
  events: [],
  activeEvent: null,
  calendars: [],
  selectedCalendars: [],

  // ✅ 캘린더 목록 불러오기
  startLoadingCalendars: async () => {
    try {
      const { data } = await calendarApi.get("/calendars");

      const calendars = (data?.calendars || []).map((c) => ({
        id: String(c._id || c.id),
        name: c.name,
        type: c.type || "my",
        ownerId: String(c.owner?._id || c.owner || ""),
      }));

      const saved = JSON.parse(localStorage.getItem(SELECTED_KEY) || "[]");
      const selected =
        Array.isArray(saved) && saved.length > 0
          ? saved.filter((id) => calendars.some((c) => c.id === id))
          : calendars.map((c) => c.id);

      set({ calendars, selectedCalendars: selected });
      localStorage.setItem(SELECTED_KEY, JSON.stringify(selected));
    } catch (err) {
      console.error("캘린더 불러오기 오류:", err);
      set({ calendars: [], selectedCalendars: [] });
      localStorage.setItem(SELECTED_KEY, JSON.stringify([]));
    }
  },

  // ✅ 이벤트 불러오기 (calendarId 정규화 + color 보존)
  startLoadingEvents: async () => {
    try {
      const { data } = await calendarApi.get("/events");
      const events = (data?.eventos || []).map((e) => ({
        ...e,
        id: String(e._id || e.id),
        start: new Date(e.start),
        end: new Date(e.end),
        calendarId: normalizeCalId(e.calendarId), // ← 핵심
        color: e.color || DEFAULT_COLOR,
      }));
      set({ events });
    } catch (err) {
      console.error("이벤트 불러오기 오류:", err);
      set({ events: [] });
    }
  },

  // ✅ 이벤트 저장 (추가/수정) — calendarId 정규화 + color 보존
  startSavingEvent: async (event) => {
    try {
      const selected = get().selectedCalendars || [];

      // 보낼 때도 문자열 ID로 확실히
      const payload = {
        ...event,
        calendarId: normalizeCalId(event.calendarId || selected[0] || ""),
        color: event.color || DEFAULT_COLOR,
      };

      if (payload._id || payload.id) {
        // ===== 수정 =====
        const id = String(payload._id || payload.id);
        const { data } = await calendarApi.put(`/events/${id}`, payload);
        const saved = data?.evento || payload;

        const calId = normalizeCalId(saved.calendarId);

        set({
          events: get().events.map((e) =>
            String(e._id || e.id) === id
              ? {
                  ...e,
                  ...saved,
                  id: String(saved._id || saved.id || id),
                  start: new Date(saved.start),
                  end: new Date(saved.end),
                  calendarId: calId,
                  color: saved.color || payload.color || DEFAULT_COLOR,
                }
              : e
          ),
        });
      } else {
        // ===== 추가 =====
        const { data } = await calendarApi.post("/events", payload);
        const saved = data?.evento || payload;

        const calId = normalizeCalId(saved.calendarId);

        set({
          events: [
            ...get().events,
            {
              ...saved,
              id: String(saved._id || saved.id),
              start: new Date(saved.start),
              end: new Date(saved.end),
              calendarId: calId,
              color: saved.color || payload.color || DEFAULT_COLOR,
            },
          ],
        });
      }
    } catch (err) {
      console.error("이벤트 저장 실패:", err);
      throw err;
    }
  },

  // ✅ 이벤트 삭제
  startDeletingEvent: async () => {
    const { activeEvent, events } = get();
    if (!activeEvent) return;

    const id = String(activeEvent._id || activeEvent.id);
    try {
      await calendarApi.delete(`/events/${id}`);
      set({
        events: events.filter((e) => String(e._id || e.id) !== id),
        activeEvent: null,
      });
    } catch (err) {
      console.error("이벤트 삭제 실패:", err);
      throw err;
    }
  },

  // ✅ 선택/해제
  setActiveEvent: (event) => set({ activeEvent: event }),
  clearActiveEvent: () => set({ activeEvent: null }),

  // ✅ 캘린더 체크박스 토글
  toggleCalendar: (id) => {
    const sid = String(id);
    const { selectedCalendars } = get();
    const next = (selectedCalendars || []).includes(sid)
      ? selectedCalendars.filter((x) => x !== sid)
      : [...(selectedCalendars || []), sid];

    set({ selectedCalendars: next });
    localStorage.setItem(SELECTED_KEY, JSON.stringify(next));
  },
}));
