import { useState, useEffect } from "react";
import { Card } from "./card";

export default function RamadanCountdown({toDate , counterTitle , isRamadan=false}) {

  const targetDate = new Date(toDate);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-10 max-w-5xl mx-auto mb-8">
      <Card className={`bg-white/5 backdrop-blur-xl border-yellow-500/30 p-4 text-center ${isRamadan?"ramada-counter-con":""}`} >
        <h3 className="text-yellow-500 text-sm mb-2 font-bold">
          {counterTitle}
        </h3>
        <div className={`flex justify-center gap-4 text-white font-mono ${isRamadan?"ramadan-numbers":""}`}>
          <div className="flex flex-col">
            <span className="text-2xl">{timeLeft.days}</span>
            <span className="text-[10px] text-slate-400">يوم</span>
          </div>
          <span className="text-2xl">:</span>
          <div className="flex flex-col">
            <span className="text-2xl">{String(timeLeft.hours).padStart(2, "0")}</span>
            <span className="text-[10px] text-slate-400">ساعة</span>
          </div>
          <span className="text-2xl">:</span>
          <div className="flex flex-col">
            <span className="text-2xl">{String(timeLeft.minutes).padStart(2, "0")}</span>
            <span className="text-[10px] text-slate-400">دقيقة</span>
          </div>
          <span className="text-2xl">:</span>
          <div className="flex flex-col">
            <span className="text-2xl">{String(timeLeft.seconds).padStart(2, "0")}</span>
            <span className="text-[10px] text-slate-400">ثانية</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
