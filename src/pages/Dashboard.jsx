import { useState, useEffect } from "react";
import Counter from "../components/Counter"
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import confetti from 'canvas-confetti';
import { 
  Star, 
  Flame, 
  Trophy, 
  Moon, 
  BookOpen, 
  AlertTriangle,
  CheckCircle2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import 'react-circular-progressbar/dist/styles.css';
import { challengesData } from "../data/challenges";

const RAMADAN_START_DATE = new Date("2026-02-18T00:00:00");

export default function Dashboard() {
  const [tempName, setTempName] = useState("");
    const [hard, setHard] = useState(true);

  const [result, setResult] = useState("");

  const [ramadanStarted, setRamadanStarted] = useState(false);
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("ramadan_user");
    return saved
      ? JSON.parse(saved)
      : { totalPoints: 0, currentStreak: 0, logs: {} };
  });

useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date();
    if (now >= RAMADAN_START_DATE && !ramadanStarted) {
      setRamadanStarted(true);

      // احسب اليوم الحالي في رمضان
      const diff = Math.floor((now - RAMADAN_START_DATE) / (1000 * 60 * 60 * 24));
      setTodayDay(Math.min(Math.max(diff + 1, 1), 30));
    }
  }, 1000);

  return () => clearInterval(interval);
}, [ramadanStarted]);

  // اليوم المحدد حالياً في التطبيق
  const [selectedDay, setSelectedDay] = useState(null);
  
  // اليوم الحالي في رمضان
  const [todayDay, setTodayDay] = useState(1);
  
  // حفظ بيانات المستخدم تلقائياً عند أي تغيير
  useEffect(() => {
    localStorage.setItem("ramadan_user", JSON.stringify(userData));
  }, [userData]);

  // حساب اليوم الحالي بناءً على رمضان والساعة 12 منتصف الليل
  useEffect(() => {
    const now = new Date();
    const diff = Math.floor((now - RAMADAN_START_DATE) / (1000 * 60 * 60 * 24));
    
    // اليوم يبدأ من 1 حتى 30، إذا قبل نص الليل اليوم يبقى اليوم السابق
    const day = Math.min(Math.max(diff + 1, 1), 30);
    setTodayDay(day);
  }, []);

  // جلب سجل يوم محدد أو افتراضي إذا لم يكن موجود
  const getDayLog = (day) => userData.logs[day] || {
    challengeCompleted: false,
    prayers: { fajr: "none", dhuhr: "none", asr: "none", maghrib: "none", isha: "none" }
  };

const updateLog = (day, updates) => {
  setUserData(prev => {
    const currentLog = prev.logs[day] || { 
      challengeCompleted: false,
      prayers: { fajr: "none", dhuhr: "none", asr: "none", maghrib: "none", isha: "none" }
    };

    const newLog = { ...currentLog, ...updates };
    let pointsAdd = 0;

    // إضافة نقاط إذا تم الانتهاء من التحدي
    if (updates.challengeCompleted && !currentLog.challengeCompleted) {
      const challenge = challengesData.find(c => c.day === day) || challengesData[0];
      pointsAdd = challenge.points;

      // تحديث الـ streak بناءً على الأيام المتتالية
      const logsCopy = { ...prev.logs, [day]: newLog };
      let streak = 0;
      for (let d = 1; d <= day; d++) {
        if (logsCopy[d]?.challengeCompleted) {
          streak += 1;
        } else {
          streak = 0; // يوم ضاع، يرجع من جديد
        }
      }

      return {
        ...prev,
        totalPoints: prev.totalPoints + pointsAdd,
        currentStreak: streak,
        logs: logsCopy
      };
    }

    return {
      ...prev,
      logs: { ...prev.logs, [day]: newLog }
    };
  });
};

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);
    formData.append("access_key", "46db0722-b0fd-4bba-9641-715c8a7897a6");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      setResult("Error");
    }
    if (!tempName.trim()) return;
    setTimeout(() => {
      console.log("عدّى 5 ثواني");
    }, 5000);
    setUserData(prev => ({ ...prev, name: tempName.trim() }));

  };




  const todayLog = getDayLog(todayDay);
  const todayChallenge = challengesData.find(c => c.day === todayDay) || challengesData[0];

  if (!ramadanStarted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#050510] via-[#0a0a20] to-[#050510] text-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-6">العد التنازلي لبداية رمضان 🕌</h1>
          <Counter toDate={RAMADAN_START_DATE.toISOString()} counterTitle="" isRamadan="true" large />
        </div>
      </div>
    );
  }

    // **إذا المستخدم جديد (لم يدخل اسمه بعد)**
  if (ramadanStarted && !userData.name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#050510] via-[#0a0a20] to-[#050510] text-center p-6">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6">أهلاً بك في تحديات رمضان!</h1>
        <p className="text-white/80 mb-6 max-w-xl">
          هذا الموقع سيساعدك على تتبع صلواتك اليومية وإتمام تحديات رمضانية ممتعة.
          كل يوم يوجد تحدي جديد يمكنك تنفيذه للحصول على نقاط وأوسمة 🏆
          <br />
          ملحوظه : اكتب اسمك كويس عشان هيطلع ليك شهاده بالاسم ده في النهايه لو التزمت
        </p>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="اكتب اسمك هنا"
            value={tempName}
            name="userName"
            onChange={(e) => setTempName(e.target.value)}
            className="px-4 py-3 rounded-lg text-black w-72 md:w-96 mb-4"
            style={{background:"transparent", border:"1px solid rgb(44 49 94)", color:"#fff"}}
            required
          />
          <span>{result}</span>
          <button
            type="submit"
            size="lg"
            className="bg-yellow-500 text-black font-bold px-8 py-3 rounded-full"
          >
            تابع
          </button>
        </form>
      </div>
    );
  }
  return (
    <div className="relative min-h-screen overflow-x-hidden p-4 md:p-8" dir="rtl">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a20] to-[#050510]" />
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

        {/* النقاط */}

      <header className="relative z-10 grid grid-cols-2 gap-4 mb-8">
        <StatCard icon={<Flame className="text-orange-500" />} label="التتابع" value={`${userData.currentStreak} يوم`} color="border-orange-500/30" />
        <StatCard icon={<Trophy className="text-emerald-400" />} label="التحديات" value={Object.values(userData.logs).filter(l => l.challengeCompleted).length} color="border-emerald-500/30" />
      </header>

      <Counter toDate="2026-03-19T00:00:00" counterTitle="الوقت المتبقي على عيد الفطر 🐑🥳 " />

      <main className="relative z-10 max-w-5xl mx-auto space-y-8 text-right">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Card className="bg-white/5 backdrop-blur-xl border-yellow-500/30 overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
                  <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full" />
                  <Moon className="w-full h-full text-yellow-500 relative z-10" />
                </div>

<div className="flex-1 text-center md:text-right space-y-4">
  {/* التحدي */}
  <h2 className="text-yellow-500 text-sm font-medium">التحدي اليومي</h2>

  <h1
    className={`text-3xl md:text-4xl font-serif text-white transition-colors duration-500 ${
      todayLog.hardMode ? "text-red-500 animate-pulseFire" : ""
    }`}
  >
    {todayLog.hardMode && todayChallenge?.hardMode ? todayChallenge.hardMode.title : todayChallenge?.title}
  </h1>
  <p className={`text-slate-300 text-lg transition-colors duration-500 ${todayLog.hardMode ? "text-orange-300" : ""}`}>
    {todayLog.hardMode && todayChallenge?.hardMode ? todayChallenge.hardMode.description : todayChallenge?.description}
  </p>

  {/* زر تحدي أصعب */}
  {hard?!todayLog.hardMode && todayChallenge?.hardMode && (
    <Button
      size="sm"
      onClick={() => {
        const newLog = { ...todayLog, hardMode: true };
        setUserData(prev => ({
          ...prev,
          logs: { ...prev.logs, [todayDay]: newLog }
        }));
      }}
      className="w-full md:w-auto h-14 px-12 text-lg rounded-full transition-all mx-2 "
    >
      تحدي أصعب
    </Button>
  ):""}

  {/* زر أتممت التحدي */}
  <Button 
    size="lg"
    onClick={() => {
      if (todayLog.challengeCompleted) return;
      setHard(false)
      const newLog = { ...todayLog, challengeCompleted: true };

      setUserData(prev => {
        const challenge = todayLog.hardMode ? todayChallenge.hardMode : todayChallenge;
        const pointsAdd = challenge.points || 0;

        // عرض الاحتفال
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#50C878', '#FFFFFF']
        });

        // تحديث currentStreak
        let newStreak = prev.currentStreak;
        if (todayDay === prev.currentStreak + 1) {
          newStreak += 1;
        } else if (todayDay > prev.currentStreak + 1) {
          newStreak = 1;
        }

        return {
          ...prev,
          totalPoints: prev.totalPoints + pointsAdd,
          currentStreak: newStreak,
          logs: { ...prev.logs, [todayDay]: newLog }
        };
      });
    }}
    className={`w-full md:w-auto h-14 px-12 text-lg rounded-full transition-all ${
      todayLog.challengeCompleted  
      ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
      : "bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold shadow-[0_0_20px_rgba(234,179,8,0.3)]"
    }`}
  >
    {todayLog.challengeCompleted 
      ? <><CheckCircle2 className="ml-2" /> تم الإنجاز</> 
      : "أتممت التحدي"}
  </Button>
</div>


              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-8">

                {/*جزء الثواب الي تحت التحدي*/}

                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex gap-4">
                  <BookOpen className="text-emerald-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-emerald-400 font-bold mb-1">الثواب</h3>
                    <p className="text-sm text-slate-300">{todayChallenge?.spiritualBenefit}</p>
                  </div>
                </div>

                {/*جزء تنبيه الي تحت التحدي*/}

                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex gap-4">
                  <AlertTriangle className="text-red-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-red-400 font-bold mb-1">تنبيه</h3>
                    <p className="text-sm text-slate-300">{todayChallenge?.warningReminder}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif text-yellow-500">تقويم رمضان</h2>
            <span className="text-slate-400">اليوم {todayDay} من 30</span>
          </div>
          {/* التقويم */}
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {[...Array(30)].map((_, i) => {
              const day = i + 1;
              const dayLog = getDayLog(day);
              const isToday = day === todayDay;
              
              let bgColor = "bg-white/5";
              let borderColor = "border-white/10";
              if (dayLog.challengeCompleted) {
                bgColor = "bg-emerald-500/20";
                borderColor = "border-emerald-500/40";
              } else if (day < todayDay) {
                bgColor = "bg-yellow-500/10";
                borderColor = "border-yellow-500/30";
              }
              if (isToday) borderColor = "border-yellow-500 ring-1 ring-yellow-500";

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all ${bgColor} ${borderColor}`}
                >
                  <span className="text-[10px] text-slate-500 mb-1">يوم</span>
                  <span className="text-lg font-serif text-white">{day}</span>
                </motion.button>
              );
            })}
          </div>
        </section>
        <Card className="bg-white/5 border-white/10 backdrop-blur-lg p-6">
  <h3 className="text-slate-400 text-sm mb-4">تتبع صلوات اليوم</h3>
  <div className="flex justify-between gap-2 overflow-x-auto pb-2">
    {["الفجر", "الظهر", "العصر", "المغرب", "العشاء"].map((p, idx) => {
      const key = ["fajr", "dhuhr", "asr", "maghrib", "isha"][idx];
      // قراءة الحالة مباشرة من userData
      const status = userData.logs[todayDay]?.prayers?.[key] || "none";

      return (
        <div key={p} className="flex-1 min-w-[70px] space-y-2 text-center">
          <span className="text-[15px] text-slate-500">{p}</span>
          <div className="flex flex-col gap-1">
            {["mosque", "home", "missed"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  // إنشاء نسخة جديدة للصلوات مع تعديل الصلاة المطلوبة
                  const newPrayers = {
                    ...userData.logs[todayDay]?.prayers,
                    [key]: s,
                  };
                  updateLog(todayDay, { prayers: newPrayers });
                }}
                className={`text-[13px] py-1 rounded-md border transition-all ${
                  status === s
                    ? s === "mosque"
                      ? "bg-emerald-500 border-emerald-400 text-white"
                      : s === "home"
                      ? "bg-blue-500 border-blue-400 text-white"
                      : "bg-red-500 border-red-400 text-white"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                {s === "mosque" ? "المسجد" : s === "home" ? "البيت" : "فاتتني"}
              </button>
            ))}
          </div>
        </div>
      );
    })}
  </div>
</Card>

        <section className="space-y-4 pb-12">
          <h2 className="text-2xl font-serif text-yellow-500">أوسمة رمضان</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 px-2">
            <Medal icon="🥉" label="5 تحديات" target={5} current={Object.values(userData.logs).filter(l => l.challengeCompleted).length} />
            <Medal icon="🥈" label="10 تحديات" target={10} current={Object.values(userData.logs).filter(l => l.challengeCompleted).length} />
            <Medal icon="🥇" label="15 تحدي" target={15} current={Object.values(userData.logs).filter(l => l.challengeCompleted).length} />
            <Medal icon="💎" label="20 تحدي" target={20} current={Object.values(userData.logs).filter(l => l.challengeCompleted).length} />
            <Medal icon="👑" label="ختام الشهر" target={30} current={Object.values(userData.logs).filter(l => l.challengeCompleted).length} />
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a20] border border-yellow-500/30 p-6 rounded-3xl max-w-sm w-full relative text-right"
            >
              <button onClick={() => setSelectedDay(null)} className="absolute top-4 left-4 text-slate-400 hover:text-white">
                <X />
              </button>
              <h2 className="text-2xl font-serif text-yellow-500 mb-4">تفاصيل يوم {selectedDay}</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">التحدي اليومي:</span>
                  <span className={getDayLog(selectedDay).challengeCompleted ? "text-emerald-400" : "text-red-400"}>
                    {getDayLog(selectedDay).challengeCompleted ? "مكتمل" : "غير مكتمل"}
                  </span>
                </div>
                <div className="space-y-2">
                  <span className="text-slate-400 block font-bold">ملخص الصلوات:</span>
                  <div className="grid grid-cols-1 gap-2 border-t border-white/5 pt-2">
                    {Object.entries(getDayLog(selectedDay).prayers).map(([p, s]) => (
                      <div key={p} className="flex justify-between items-center text-xs">
                         <span className="text-slate-500">
                          {p === 'fajr' ? 'الفجر' : p === 'dhuhr' ? 'الظهر' : p === 'asr' ? 'العصر' : p === 'maghrib' ? 'المغرب' : 'العشاء'}
                        </span>
                        <span className={`px-2 py-0.5 rounded ${s === 'mosque' ? 'text-emerald-400 bg-emerald-400/10' : s === 'home' ? 'text-blue-400 bg-blue-400/10' : s === 'missed' ? 'text-red-400 bg-red-400/10' : 'text-slate-600'}`}>
                          {s === 'mosque' ? 'المسجد' : s === 'home' ? 'البيت' : s === 'missed' ? 'فاتتني' : 'لم تسجل'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        <footer>
          <p> هذا الموقع من تطوير Youssef abbas <a href="https://wa.me/01027295412" target="_blank"><i className="fa-brands fa-whatsapp" style={{color: "rgba(22, 220, 39, 1.00)" , fontSize : "20px"}}></i></a> </p>
        </footer>
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <Card className={`bg-white/5 backdrop-blur-md border ${color}`}>
      <CardContent className="p-3 md:p-4 flex items-center gap-3">
        <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
        <div>
          <p className="text-[10px] md:text-xs text-slate-400">{label}</p>
          <p className="text-sm md:text-lg font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Medal({ icon, label, target, current }) {
  const isLocked = current < target;
  return (
    <div className={`flex-shrink-0 w-32 p-4 rounded-2xl border flex flex-col items-center space-y-2 transition-all duration-500 ${isLocked ? 'bg-black/40 border-white/5 opacity-40' : 'bg-white/5 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]'}`}>
      <span className="text-4xl filter grayscale-[0.5]">{icon}</span>
      <span className="text-sm font-bold text-center">{label}</span>
      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
        <div className="bg-yellow-500 h-full transition-all duration-1000" style={{ width: `${Math.min((current/target)*100, 100)}%` }} />
      </div>
      <span className="text-[10px] text-slate-500">{current} / {target}</span>
    </div>
  );
}
