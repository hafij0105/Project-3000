import { TrendingUp } from "lucide-react";

interface CgpaWidgetProps {
  cgpa: number;
  maxCgpa?: number;
}

export default function CgpaWidget({ cgpa, maxCgpa = 4.0 }: CgpaWidgetProps) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = cgpa / maxCgpa;
  const offset = circumference - progress * circumference;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-metro-dark mb-4">Academic Progress</h3>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <circle
              className="text-gray-200"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="60"
              cy="60"
            />
            <circle
              className="text-metro-green"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="60"
              cy="60"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <TrendingUp className="text-metro-green mb-1" size={24} />
            <span className="text-2xl font-bold text-metro-dark">{cgpa.toFixed(2)}</span>
            <span className="text-sm text-metro-muted">CGPA</span>
          </div>
        </div>
        <p className="text-center text-sm text-metro-muted">
          You are performing excellently. Keep up the great work!
        </p>
      </div>
    </div>
  );
}