import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Check, Clock, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { sounds } from '../utils/soundUtils';
import { formatNum } from '../utils/numberUtils';

interface PomodoroTimerProps {
  numberFormat: 'bn' | 'en';
  activeSubjectName?: string;
  onSessionComplete?: () => void;
}

type Mode = 'focus' | 'shortBreak' | 'longBreak';

const MODE_DURATIONS: Record<Mode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  numberFormat,
  activeSubjectName,
  onSessionComplete,
}) => {
  const isBn = numberFormat === 'bn';
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sounds.isEnabled());

  const timerRef = useRef<number | null>(null);

  // Switch mode
  const switchMode = (newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
  };

  // Tick countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            sounds.playChime();
            if (mode === 'focus') {
              setCompletedSessions((s) => s + 1);
              onSessionComplete?.();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, onSessionComplete]);

  // Format mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const displayTime = isBn
    ? `${formatNum(minutes, true).padStart(2, '০')}:${formatNum(seconds, true).padStart(2, '০')}`
    : timeFormatted;

  const totalTime = MODE_DURATIONS[mode];
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  const toggleSound = () => {
    const next = sounds.toggle();
    setSoundEnabled(next);
  };

  return (
    <div className="bg-white dark:bg-[#18191d] rounded-xl border border-stone-200/80 dark:border-zinc-800 shadow-2xs overflow-hidden transition-all">
      {/* Mini top bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3 bg-stone-50/60 dark:bg-zinc-850/40 border-b border-stone-200/60 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
            Study Focus Timer (পোমোডোরো)
          </span>
          {activeSubjectName && (
            <span className="text-[11px] px-2 py-0.2 rounded bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 truncate max-w-[150px]">
              {activeSubjectName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick time display in header */}
          <span className="font-mono text-xs font-bold text-stone-800 dark:text-stone-200">
            {displayTime}
          </span>

          {/* Quick Play/Pause */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-1.5 rounded-lg text-white text-xs cursor-pointer transition-colors ${
              isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded cursor-pointer"
            title={isExpanded ? 'Collapse' : 'Expand controls'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress hairline */}
      <div className="w-full h-1 bg-stone-100 dark:bg-zinc-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Mode switch tabs */}
          <div className="flex items-center justify-center gap-1.5 p-1 bg-stone-100 dark:bg-zinc-850 rounded-lg text-xs">
            <button
              onClick={() => switchMode('focus')}
              className={`flex-1 py-1 px-2 rounded-md font-medium transition-colors cursor-pointer ${
                mode === 'focus'
                  ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Focus (২৫ মিনিট)
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              className={`flex-1 py-1 px-2 rounded-md font-medium transition-colors cursor-pointer ${
                mode === 'shortBreak'
                  ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Short Break (৫ মিনিট)
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`flex-1 py-1 px-2 rounded-md font-medium transition-colors cursor-pointer ${
                mode === 'longBreak'
                  ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Long Break (১৫ মিনিট)
            </button>
          </div>

          {/* Large timer display */}
          <div className="text-center py-2">
            <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-stone-900 dark:text-stone-100">
              {displayTime}
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
              {mode === 'focus'
                ? 'গভীর মনোযোগে পড়ার সময় — সব ডিস্ট্র্যাকশন দূরে রাখুন'
                : 'চোখ ও শরীরকে বিশ্রাম দিন, পানি পান করুন'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(MODE_DURATIONS[mode]);
              }}
              className="p-2 rounded-lg border border-stone-200 dark:border-zinc-750 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-zinc-800 cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-2 rounded-lg text-white font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-all ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Focus Session</span>
                </>
              )}
            </button>

            <button
              onClick={() => setTimeLeft((t) => t + 5 * 60)}
              className="px-2.5 py-2 rounded-lg border border-stone-200 dark:border-zinc-750 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-zinc-800 text-xs font-mono font-medium cursor-pointer"
              title="Add 5 Minutes"
            >
              +5m
            </button>

            <button
              onClick={toggleSound}
              className="p-2 rounded-lg border border-stone-200 dark:border-zinc-750 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-zinc-800 cursor-pointer"
              title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Session counter */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-200/60 dark:border-zinc-800">
            <span>আজকের সম্পন্ন সেশন:</span>
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              {formatNum(completedSessions, isBn)} টি ফোকাস সেশন
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
