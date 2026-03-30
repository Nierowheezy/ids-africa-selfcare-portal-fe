"use client";

import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RemainingDaysCardProps {
  daysLeft: number;
  totalDays: number;
}

export function RemainingDaysCard({
  daysLeft,
  totalDays,
}: RemainingDaysCardProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0);

  const safeDays = Math.max(0, daysLeft);
  const realPercentage = (safeDays / totalDays) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayPercentage(realPercentage);
    }, 300);

    return () => clearTimeout(timer);
  }, [realPercentage]);

  // Color: red when ≤7 days (matches production at 6 days = red)
  const pathColor = safeDays <= 7 ? "#dc2626" : "#16a34a";

  return (
    <Card className="shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-lg font-heading text-gray-700">
          Service days remaining
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-8">
        <div className="w-52 h-52 relative">
          <CircularProgressbar
            value={displayPercentage}
            text=""
            maxValue={100}
            minValue={0}
            circleRatio={1}
            strokeWidth={6}
            styles={buildStyles({
              pathTransitionDuration: 2.5,
              pathTransition: "ease-out",
              pathColor,
              trailColor: "#e5e7eb",
              backgroundColor: "#fff",
              textSize: "0",
            })}
          />

          {/* Text inside circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <p
              className={`text-5xl font-bold leading-none ${
                safeDays <= 7 ? "text-red-600" : "text-green-600"
              }`}
            >
              {safeDays}
            </p>
            <p className="text-base font-medium text-gray-700 uppercase tracking-wide mt-1">
              days left
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
