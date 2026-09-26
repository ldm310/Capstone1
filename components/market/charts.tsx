"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Cell,
  LabelList,
} from "recharts";
import { useReducedMotion } from "motion/react";
import type { MarketDataset, MarketSkill } from "@/types/career";
export function MarketSkillChart({ skills }: { skills: MarketSkill[] }) {
  const reduced = useReducedMotion();
  return (
    <div
      className="market-chart"
      role="img"
      aria-label={skills.map((s) => `${s.name}: ${s.demand}%`).join(", ")}
    >
      <ResponsiveContainer width="100%" height={250} minWidth={0}>
        <BarChart
          data={skills}
          layout="vertical"
          margin={{ top: 0, left: 0, right: 38, bottom: 0 }}
          barSize={12}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 8, fill: "#a1afa5" }}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={80}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#688172" }}
          />
          <CartesianGrid
            horizontal={false}
            stroke="#edf2ee"
            strokeDasharray="3 4"
          />
          <Tooltip
            cursor={{ fill: "#f5f9f6" }}
            contentStyle={{
              borderRadius: 9,
              border: "1px solid #e3ebe5",
              fontSize: 11,
            }}
            formatter={(v) => [`${v}%`, "공고 내 언급 비율"]}
          />
          <Bar
            dataKey="demand"
            radius={[0, 3, 3, 0]}
            isAnimationActive={!reduced}
            animationDuration={350}
          >
            {skills.map((s, i) => (
              <Cell
                key={s.skillId}
                fill={i === 0 ? "#426d90" : i < 3 ? "#8babc4" : "#c7d8e5"}
              />
            ))}
            <LabelList
              dataKey="demand"
              position="right"
              fontSize={9}
              fill="#779382"
              formatter={(v) => `${v}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export function SkillTrendChart({
  data,
  names,
}: {
  data: MarketDataset["trend"];
  names: string[];
}) {
  const reduced = useReducedMotion();
  const colors = ["#315a7b", "#779cb9", "#9eabb8"];
  return (
    <>
      <div role="img" aria-label={`${names.join(", ")} 월별 수요 추이`}>
        <ResponsiveContainer width="100%" height={250} minWidth={0}>
          <LineChart
            data={data}
            margin={{ top: 15, right: 12, left: -28, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#edf2ee"
              strokeDasharray="3 4"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "#99aaa0" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "#99aaa0" }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                borderRadius: 8,
                border: "1px solid #e3ebe5",
              }}
            />
            {names.map((name, i) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={colors[i]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={!reduced}
                animationDuration={350}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-legend">
        {names.map((name, i) => (
          <span key={name}>
            <i style={{ background: colors[i] }} />
            {name}
          </span>
        ))}
      </div>
    </>
  );
}
