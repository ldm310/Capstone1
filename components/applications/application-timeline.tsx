import { Check, Circle } from "lucide-react";
import type { Application } from "@/types/career";
import { stageLabels } from "@/lib/korean";
export function ApplicationTimeline({
  application,
}: {
  application: Application;
}) {
  return (
    <ol className="application-timeline">
      {application.timeline.map((event, i) => (
        <li key={`${event.stage}-${i}`}>
          <span
            className={`timeline-dot ${i === application.timeline.length - 1 ? "current" : ""}`}
          >
            {i === application.timeline.length - 1 ? (
              <Circle size={10} />
            ) : (
              <Check size={10} />
            )}
          </span>
          <div>
            <strong>{stageLabels[event.stage]}</strong>
            <time>{event.date}</time>
            <p>{event.note}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
