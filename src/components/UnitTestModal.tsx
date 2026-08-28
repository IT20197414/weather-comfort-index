import React, { useEffect, useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Play,
  RefreshCw,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { TestSuiteOutcome } from '../types';

interface UnitTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnitTestModal: React.FC<UnitTestModalProps> = ({ isOpen, onClose }) => {
  const [outcome, setOutcome] = useState<TestSuiteOutcome | null>(null);
  const [running, setRunning] = useState(false);

  const runTests = async () => {
    setRunning(true);
    try {
      const res = await fetch('/api/tests/run');
      if (res.ok) {
        const data = await res.json();
        setOutcome(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runTests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between bg-stone-50/50 dark:bg-stone-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                <span>Comfort Index Unit Test Suite</span>
                {outcome && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                      outcome.failed === 0
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {outcome.passed}/{outcome.total} Passed
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Automated mathematical bounds, physics validation, and edge-case assertions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Top Summary Banner */}
          <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
            <div>
              <span className="text-xs text-stone-500 block">Suite Execution Status</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {outcome ? `${outcome.passed} of ${outcome.total} Tests Passing` : 'Executing tests...'}
                </span>
              </div>
            </div>

            <button
              onClick={runTests}
              disabled={running}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
              <span>Re-run Suite</span>
            </button>
          </div>

          {/* Test Results List */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {outcome?.results.map((test, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-start justify-between text-xs transition-colors ${
                  test.passed
                    ? 'bg-stone-50/50 dark:bg-stone-800/30 border-stone-200 dark:border-stone-800'
                    : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                }`}
              >
                <div className="flex items-start space-x-2.5">
                  {test.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100">
                      {test.name}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5 flex items-center space-x-2 font-mono">
                      <span>Suite: {test.suite}</span>
                      <span>•</span>
                      <span>Expected: {test.expected}</span>
                      <span>•</span>
                      <span>Actual: {test.actual}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-stone-400 shrink-0 ml-2">
                  {test.durationMs}ms
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex justify-end bg-stone-50 dark:bg-stone-900">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Close Results
          </button>
        </div>
      </div>
    </div>
  );
};
