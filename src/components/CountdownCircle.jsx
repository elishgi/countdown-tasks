import { useEffect, useState } from "react";
import dayjs from "dayjs";

const CountdownCircle = ({ title, deadline, totalDays, color = "#0ff", onClick, onDelete }) => {
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    const calcDaysLeft = () => {
      const now = dayjs();
      const end = dayjs(deadline);
      const diff = end.diff(now, "day");
      setDaysLeft(diff);
    };

    calcDaysLeft();
    const interval = setInterval(calcDaysLeft, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [deadline]);

  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = daysLeft / totalDays;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      style={{
        position: "relative", // חשוב למיקום כפתור ❌
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.2em",
        margin: "0 2em",
        cursor: onClick ? "pointer" : "default",
        background: "none",
        boxShadow: "none"
      }}
      onClick={onClick}
    >
      <svg height={radius * 2} width={radius * 2} style={{ background: "transparent" }}>
        <circle
          stroke="#222"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 1s",
            filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 10px ${color})`
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="22"
          fill={color}
          style={{ filter: `drop-shadow(0 0 2px ${color})` }}
        >
          {daysLeft}
        </text>
      </svg>
      <div style={{ color: "#ccc", fontSize: "0.9em", marginTop: "-5px" }}>{title}</div>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            background: "#f00",
            border: "none",
            color: "white",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            cursor: "pointer"
          }}
        >
          ✖
        </button>
      )}
    </div>
  );
};

export default CountdownCircle;
