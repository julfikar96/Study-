import React, { useRef, useState } from 'react';
import { Download, Upload, X, Check, AlertCircle, FileText, Printer } from 'lucide-react';
import { Subject } from '../types';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onImport: (data: unknown) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  // Export JSON
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(subjects, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `my-study-tracker-backup-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImport(json);
        setImportStatus({ type: 'success', message: 'ব্যাকআপ সফলভাবে রিস্টোর করা হয়েছে!' });
        setTimeout(() => {
          setImportStatus(null);
          onClose();
        }, 1500);
      } catch (err: unknown) {
        setImportStatus({
          type: 'error',
          message: err instanceof Error ? err.message : 'ফাইলটি পড়া যায়নি। সঠিক JSON ফাইল নির্বাচন করুন।',
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Print Summary
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                ব্যাকআপ ও রিস্টোর
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                আপনার পড়াশোনার সকল ডেটা নিরাপদে সংরক্ষণ করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {importStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                importStatus.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {importStatus.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Export card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  ব্যাকআপ ফাইল ডাউনলোড করুন
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  আপনার সকল বিষয়ের চেকলিস্ট ডেটা একটি JSON ফাইল হিসেবে সেভ থাকবে।
                </p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>ডাউনলোড ব্যাকআপ (.json)</span>
            </button>
          </div>

          {/* Import card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                পূর্বে সেভ করা ব্যাকআপ রিস্টোর করুন
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                অন্য ডিভাইস বা ব্রাউজার থেকে পূর্বে ডাউনলোড করা ফাইল আপলোড করুন।
              </p>
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
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>ফাইল নির্বাচন করুন (.json)</span>
            </button>
          </div>

          {/* Print summary */}
          <div className="pt-2">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট বা PDF হিসেবে সংরক্ষণ করুন</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
