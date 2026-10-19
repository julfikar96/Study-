import React, { useRef, useState } from 'react';
import {
  X,
  Download,
  Upload,
  Printer,
  RotateCcw,
  Sun,
  Moon,
  AlertTriangle,
  Check,
  Languages,
} from 'lucide-react';
import { Subject } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  numberFormat: 'bn' | 'en';
  onToggleNumberFormat: () => void;
  onImportData: (data: unknown) => void;
  onOpenResetConfirm: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  subjects,
  theme,
  onToggleTheme,
  numberFormat,
  onToggleNumberFormat,
  onImportData,
  onOpenResetConfirm,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(subjects, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `studytrack-backup-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setFeedback('ব্যাকআপ ফাইল ডাউনলোড হয়েছে');
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImportData(json);
        setFeedback('ব্যাকআপ সফলভাবে রিস্টোর করা হয়েছে!');
        setTimeout(() => {
          setFeedback(null);
          onClose();
        }, 1500);
      } catch (err) {
        setFeedback('অবৈধ JSON ফাইল। সঠিক ব্যাকআপ নির্বাচন করুন।');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#18191d] rounded-xl max-w-lg w-full border border-stone-200/80 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200/70 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
              Settings & Preferences
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              অ্যাপের পছন্দসমূহ, ডেটা ব্যাকআপ ও রিসেট কন্ট্রোল
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {feedback && (
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-medium">
              {feedback}
            </div>
          )}

          {/* Preferences Section */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Preferences (পছন্দসমূহ)
            </h4>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-stone-200/70 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-850/40">
              <div>
                <span className="font-medium text-stone-900 dark:text-stone-100 block">
                  Appearance Theme
                </span>
                <span className="text-stone-500 text-[11px]">
                  {theme === 'dark' ? 'Dark Mode (ডার্ক মোড সক্রিয়)' : 'Light Mode (লাইট মোড সক্রিয়)'}
                </span>
              </div>
              <button
                onClick={onToggleTheme}
                className="px-3 py-1.5 rounded-md border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-stone-700 dark:text-stone-200 font-medium inline-flex items-center gap-1.5 cursor-pointer hover:bg-stone-50"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>

            {/* Number format toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-stone-200/70 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-850/40">
              <div>
                <span className="font-medium text-stone-900 dark:text-stone-100 block">
                  Number Representation
                </span>
                <span className="text-stone-500 text-[11px]">
                  {numberFormat === 'bn' ? 'বাংলা সংখ্যা (১, ২, ৩)' : 'English Digits (1, 2, 3)'}
                </span>
              </div>
              <button
                onClick={onToggleNumberFormat}
                className="px-3 py-1.5 rounded-md border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-stone-700 dark:text-stone-200 font-mono font-medium cursor-pointer hover:bg-stone-50"
              >
                {numberFormat === 'bn' ? 'Switch to 1,2,3' : 'বাংলায় দেখুন'}
              </button>
            </div>
          </div>

          {/* Backup & Data Section */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Data Storage & Backup (ব্যাকআপ)
            </h4>

            <div className="p-3.5 rounded-lg border border-stone-200/70 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-stone-900 dark:text-stone-100 block">
                    Export Study Progress JSON
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    আপনার পড়াশোনার সকল চেকলিস্ট ও ডেটা একটি ফাইলে সেভ করুন
                  </span>
                </div>
                <button
                  onClick={handleExportJSON}
                  className="px-3 py-1.5 rounded-md bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-medium inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>

              <div className="border-t border-stone-200/60 dark:border-zinc-800/80 pt-3 flex items-center justify-between">
                <div>
                  <span className="font-medium text-stone-900 dark:text-stone-100 block">
                    Restore Backup File
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    পূর্বে ডাউনলোড করা JSON ফাইল আপলোড করে ডেটা ফিরিয়ে আনুন
                  </span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-md border border-stone-200 dark:border-zinc-700 text-stone-700 dark:text-stone-300 font-medium inline-flex items-center gap-1.5 hover:bg-stone-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
              </div>

              <div className="border-t border-stone-200/60 dark:border-zinc-800/80 pt-3 flex items-center justify-between">
                <div>
                  <span className="font-medium text-stone-900 dark:text-stone-100 block">
                    Print / PDF Summary
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    একটি পরিষ্কার প্রিন্ট ভিউ তৈরি করুন
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    window.print();
                  }}
                  className="px-3 py-1.5 rounded-md border border-stone-200 dark:border-zinc-700 text-stone-700 dark:text-stone-300 font-medium inline-flex items-center gap-1.5 hover:bg-stone-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone: Reset Progress */}
          <div className="space-y-2 pt-2 border-t border-stone-200/70 dark:border-zinc-800">
            <h4 className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Danger Zone
            </h4>
            <div className="flex items-center justify-between p-3 rounded-lg border border-rose-200/70 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20">
              <div>
                <span className="font-medium text-rose-900 dark:text-rose-300 block">
                  Reset Progress (প্রগ্রেস রিসেট)
                </span>
                <span className="text-stone-500 dark:text-stone-400 text-[11px]">
                  চেকলিস্টের টিকচিহ্ন মুছে শূন্য করুন বা ফ্যাক্টরি সেটিংসে ফিরুন
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenResetConfirm();
                }}
                className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-medium cursor-pointer"
              >
                Reset...
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200/70 dark:border-zinc-800 flex justify-end bg-stone-50/50 dark:bg-zinc-850/30">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-stone-200/70 dark:bg-zinc-800 text-stone-700 dark:text-stone-300 font-medium hover:bg-stone-300/70 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
