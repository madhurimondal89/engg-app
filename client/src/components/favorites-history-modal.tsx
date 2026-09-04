import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  History,
  Bookmark,
  Trash2,
  Download,
  Share2,
  Clock,
  CheckCircle2,
  Search
} from 'lucide-react';

export interface SavedCalcItem {
  id: string;
  title: string;
  discipline: string;
  timestamp: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
}

const SAMPLE_HISTORY: SavedCalcItem[] = [
  {
    id: 'h1',
    title: 'Transformer Tan Delta & Capacitance',
    discipline: 'Electrical',
    timestamp: 'Just now',
    inputs: { testVoltage: '10 kV', measuredPower: '2.5 W', current: '7.8 mA' },
    outputs: { dissipationFactor: '0.32 %', status: 'GOOD', capacitance: '2.48 nF' },
  },
  {
    id: 'h2',
    title: 'Simply Supported Beam (Mid Point Load)',
    discipline: 'Mechanical',
    timestamp: '15 mins ago',
    inputs: { span: '6 m', load: '20 kN', pos: '3 m' },
    outputs: { R1: '10 kN', R2: '10 kN', M_max: '30 kNm' },
  },
  {
    id: 'h3',
    title: 'Concrete Mix M25 Design',
    discipline: 'Civil',
    timestamp: '2 hours ago',
    inputs: { volume: '10 m³', ratio: '1:1:2 (M25)' },
    outputs: { cementBags: '110 Bags', sandVolume: '4.2 m³', aggregateVolume: '8.4 m³' },
  },
];

export default function FavoritesHistoryModal({
  open,
  onOpenChange,
  onRestoreCalculation,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestoreCalculation?: (item: SavedCalcItem) => void;
}) {
  const [historyItems, setHistoryItems] = useState<SavedCalcItem[]>(SAMPLE_HISTORY);
  const [search, setSearch] = useState('');

  const filtered = historyItems.filter(
    h =>
      h.title.toLowerCase().includes(search.toLowerCase()) ||
      h.discipline.toLowerCase().includes(search.toLowerCase())
  );

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(historyItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `engineering_calculations_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const clearHistory = () => {
    setHistoryItems([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 p-0 rounded-2xl shadow-2xl">
        <DialogHeader className="p-6 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/70">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <DialogTitle className="text-xl font-outfit font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                Calculation History & Bookmarks
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
                Stored calculations session with instant restore and export options
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportJSON}
                className="text-xs h-8 gap-1.5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Download className="w-3.5 h-3.5" />
                Export JSON
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-xs h-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search past calculations..."
              className="h-9 pl-9 text-xs bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No calculation history recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mr-2">
                        {item.discipline}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Inputs</span>
                      {Object.entries(item.inputs).map(([k, v]) => (
                        <div key={k} className="text-slate-700 dark:text-slate-300">
                          {k}: <span className="text-cyan-600 dark:text-cyan-400 font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Results</span>
                      {Object.entries(item.outputs).map(([k, v]) => (
                        <div key={k} className="text-slate-700 dark:text-slate-300">
                          {k}: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
