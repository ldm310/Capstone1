"use client";
import type { PanelProps } from "./types";
import { CalendarDays } from "lucide-react";
import { id } from "./helpers";
export function SchedulePanel({
  state,
  busy,
  save,
}: Pick<PanelProps, "state" | "busy" | "save">) {
  return (
    <section className="career-panel">
      <h2>
        <CalendarDays size={20} /> 지원 일정과 마감 알림
      </h2>
      <p>
        7일 이내 일정은 ‘지금 할 일’ 화면에 표시됩니다. 브라우저를 닫아도 알림을
        받으려면 캘린더 파일을 내려받아 사용하는 캘린더에 추가하세요.
        이메일·푸시 발송은 아직 연결되지 않았습니다.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget,
            f = new FormData(form);
          const result = await save("events", {
            events: [
              ...state.events,
              {
                id: id(),
                title: f.get("title"),
                date: f.get("date"),
                type: f.get("type"),
              },
            ],
          });
          if (result) form.reset();
        }}
      >
        <div className="career-two">
          <label>
            일정 이름
            <input
              name="title"
              required
              maxLength={200}
              placeholder="예: 채널코퍼레이션 1차 면접"
            />
          </label>
          <label>
            일정 종류
            <select name="type">
              {["공고 마감", "코딩테스트", "면접", "기타"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            날짜·시간
            <input name="date" type="datetime-local" required />
          </label>
        </div>
        <button disabled={busy}>일정 추가</button>
      </form>
      {[...state.events]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((event) => (
          <div className="career-row" key={event.id}>
            <div>
              <strong>{event.title}</strong>
              <p>
                {event.date.replace("T", " ")} · {event.type}
              </p>
            </div>
            <button
              disabled={busy}
              onClick={() =>
                save("events", {
                  events: state.events.filter((e) => e.id !== event.id),
                })
              }
            >
              삭제
            </button>
          </div>
        ))}
      <button
        disabled={!state.events.length}
        onClick={() => {
          const esc = (s: string) =>
            s
              .replace(/\\/g, "\\\\")
              .replace(/\n/g, "\\n")
              .replace(/,/g, "\\,")
              .replace(/;/g, "\\;");
          const text = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Career//Schedules//KO",
            ...state.events.flatMap((e) => [
              "BEGIN:VEVENT",
              `UID:${e.id}@career`,
              `DTSTAMP:${new Date()
                .toISOString()
                .replace(/[-:]/g, "")
                .replace(/\.\d+Z/, "Z")}`,
              `DTSTART:${e.date.replace(/[-:]/g, "")}00`,
              `SUMMARY:${esc(e.title)}`,
              "BEGIN:VALARM",
              "TRIGGER:-P1D",
              "ACTION:DISPLAY",
              `DESCRIPTION:${esc(e.title)}`,
              "END:VALARM",
              "END:VEVENT",
            ]),
            "END:VCALENDAR",
          ].join("\r\n");
          const url = URL.createObjectURL(
            new Blob([text], { type: "text/calendar" }),
          );
          const a = document.createElement("a");
          a.href = url;
          a.download = "career-schedule.ics";
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }}
      >
        캘린더에 추가할 파일 받기 (.ics)
      </button>
    </section>
  );
}
