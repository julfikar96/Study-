import React, { useState } from 'react';
import { AlertCircle, X, RotateCcw, RefreshCw } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetProgressOnly: () => void;
  onResetAllToDefault: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onResetProgressOnly,
  onResetAllToDefault,
}) => {
  const [resetType, setResetType] = useState<'progress' | 'full'>('progress');

  if (!isOpen) return null;

  const handleExecuteReset = () => {
    if (resetType === 'progress') {
      onResetProgressOnly();
    } else {
      onResetAllToDefault();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#18191d] rounded-xl max-w-md w-full border border-stone-200/80 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200/70 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-stone-100 dark:bg-zinc-800 flex items-center justify-center text-stone-600 dark:text-stone-300">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
              Confirm Progress Reset
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-stone-500 dark:text-stone-400">
            রিসেট করার ধরন নির্বাচন করুন:
          </p>

          <div className="space-y-2">
            {/* Option 1: Progress only */}
            <div
              onClick={() => setResetType('progress')}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                resetType === 'progress'
                  ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-zinc-800/80'
                  : 'border-stone-200/70 dark:border-zinc-800 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone-900 dark:text-stone-100">
                  শুধু চেকলিস্টের টিক মুছুন (প্রস্তাবিত)
                </span>
                <input
                  type="radio"
                  name="resetType"
                  checked={resetType === 'progress'}
                  onChange={() => setResetType('progress')}
                  className="accent-stone-900 dark:accent-stone-100"
                />
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                আপনার বিষয় এবং পরিবর্তিত অধ্যায়ের নামগুলো ঠিক থাকবে, শুধু সকল চেকমার্ক শূন্য করা হবে।
              </p>
            </div>

            {/* Option 2: Full factory reset */}
            <div
              onClick={() => setResetType('full')}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                resetType === 'full'
                  ? 'border-rose-600 dark:border-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                  : 'border-stone-200/70 dark:border-zinc-800 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-rose-700 dark:text-rose-400">
                  সম্পূর্ণ রিসেট (ফ্যাক্টরি ডিফল্ট)
                </span>
                <input
                  type="radio"
                  name="resetType"
                  checked={resetType === 'full'}
                  onChange={() => setResetType('full')}
                  className="accent-rose-600"
                />
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                সকল পরিবর্তন মুছে প্রাথমিক ১০টি বিষয় ও ১৭০টি অধ্যায়ের তালিকায় ফিরে যাবে।
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-md bg-stone-100 dark:bg-zinc-800/60 border border-stone-200/60 dark:border-zinc-700/60 text-stone-600 dark:text-stone-400 text-[11px]">
            ⚠️ এই অ্যাকশনটি সম্পন্ন হলে পূর্বের টিকচিহ্নগুলো ফিরিয়ে আনা যাবে না।
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200/70 dark:border-zinc-800 flex justify-end gap-2 bg-stone-50/50 dark:bg-zinc-850/30">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-zinc-800 font-medium text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecuteReset}
            className={`px-3.5 py-1.5 rounded-md text-white font-medium text-xs transition-colors cursor-pointer ${
              resetType === 'full'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:opacity-90'
            }`}
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
};
