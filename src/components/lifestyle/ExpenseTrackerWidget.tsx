"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataStoreRepository } from "@/repositories/dataStore";
import { ExpenseLog, ExpenseCategory, ImpulseHoldingItem } from "@/types/lifestyle";
import {
  Wallet,
  Plus,
  ShieldAlert,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Tag,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Flame,
} from "lucide-react";

const CATEGORIES: ExpenseCategory[] = [
  "Food & Dining",
  "Transport & Fuel",
  "Tools & Software",
  "Health & Fitness",
  "Books & Learning",
  "Entertainment",
  "General & Living",
];

export const ExpenseTrackerWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"quick_log" | "impulse_vault">("quick_log");
  const [todayTotal, setTodayTotal] = useState<number>(0);
  const [expenseLogs, setExpenseLogs] = useState<ExpenseLog[]>([]);
  const [impulseItems, setImpulseItems] = useState<ImpulseHoldingItem[]>([]);
  const [isNoSpendActive, setIsNoSpendActive] = useState<boolean>(false);

  // Quick Expense Form state
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<ExpenseCategory>("Food & Dining");
  const [description, setDescription] = useState<string>("");
  const [isImpulse, setIsImpulse] = useState<boolean>(false);

  // Impulse Vault Form state
  const [impulseName, setImpulseName] = useState<string>("");
  const [impulsePrice, setImpulsePrice] = useState<string>("");
  const [impulseCat, setImpulseCat] = useState<ExpenseCategory>("Entertainment");
  const [impulseNotes, setImpulseNotes] = useState<string>("");

  const loadData = () => {
    const total = DataStoreRepository.getTodayExpenseTotal();
    setTodayTotal(total);
    setExpenseLogs(DataStoreRepository.getExpenseLogs());
    setImpulseItems(DataStoreRepository.getImpulseHoldingItems());

    // Check if user has an active no_spend streak logged today
    const streaks = DataStoreRepository.getDailyStreaks();
    const noSpendStreak = streaks.find((s) => s.category === "no_spend");
    const today = new Date().toISOString().split("T")[0];
    if (noSpendStreak && noSpendStreak.lastLoggedDate === today && total === 0) {
      setIsNoSpendActive(true);
    } else {
      setIsNoSpendActive(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("ptos-data-change", loadData);
    return () => window.removeEventListener("ptos-data-change", loadData);
  }, []);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newLog: ExpenseLog = {
      id: `exp-${Date.now()}`,
      userId: "user-demo-1",
      date: new Date().toISOString().split("T")[0],
      amount: parsedAmount,
      category,
      description: description.trim() || category,
      isImpulse,
      createdAt: new Date().toISOString(),
    };

    DataStoreRepository.saveExpenseLog(newLog);
    setAmount("");
    setDescription("");
    setIsImpulse(false);
    setIsNoSpendActive(false);
  };

  const handleToggleNoSpendDay = () => {
    if (!isNoSpendActive) {
      DataStoreRepository.recordStreakAction("no_spend");
      setIsNoSpendActive(true);
    }
  };

  const handleCreateImpulseItem = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(impulsePrice);
    if (!impulseName.trim() || isNaN(price) || price <= 0) return;

    const newItem: ImpulseHoldingItem = {
      id: `imp-${Date.now()}`,
      userId: "user-demo-1",
      itemName: impulseName.trim(),
      price,
      category: impulseCat,
      notes: impulseNotes.trim() || undefined,
      targetCooldownHours: 72,
      createdAt: new Date().toISOString(),
      status: "cooling",
    };

    DataStoreRepository.saveImpulseHoldingItem(newItem);
    setImpulseName("");
    setImpulsePrice("");
    setImpulseNotes("");
  };

  const handleResolveImpulse = (item: ImpulseHoldingItem, outcome: "resisted_saved" | "bought") => {
    const updated: ImpulseHoldingItem = {
      ...item,
      status: outcome,
    };
    DataStoreRepository.saveImpulseHoldingItem(updated);

    if (outcome === "resisted_saved") {
      // Record in Wins and Evidence
      DataStoreRepository.saveWin({
        id: `win-imp-${Date.now()}`,
        userId: "user-demo-1",
        title: `Impulse Conquered: Saved $${item.price.toFixed(2)}`,
        notes: `Cooled off for 72h on ${item.itemName} and decided against buying.`,
        category: "comeback",
        createdAt: new Date().toISOString(),
      });

      DataStoreRepository.saveIdentityEvidence({
        id: `ev-imp-${Date.now()}`,
        userId: "user-demo-1",
        timestamp: new Date().toISOString(),
        identityStatement: "I have intentional financial discipline and resist instant dopamine consumption.",
        evidenceAction: `Saved $${item.price.toFixed(2)} by waiting out 72h cooling-off period on ${item.itemName}.`,
      });
    } else {
      // Log as expense
      DataStoreRepository.saveExpenseLog({
        id: `exp-${Date.now()}`,
        userId: "user-demo-1",
        date: new Date().toISOString().split("T")[0],
        amount: item.price,
        category: item.category,
        description: `(After 72h Cooling) ${item.itemName}`,
        isImpulse: false,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const coolingItems = impulseItems.filter((i) => i.status === "cooling");
  const totalSaved = impulseItems
    .filter((i) => i.status === "resisted_saved")
    .reduce((sum, i) => sum + i.price, 0);

  return (
    <Card className="p-5 bg-white border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80">
              <Wallet size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Financial Discipline & Expenses</h3>
              <p className="text-[11px] text-slate-500">Fast 5s logger + 72h Impulse Cooling Vault</p>
            </div>
          </div>

          {/* Sub tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("quick_log")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                activeTab === "quick_log"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Log Expense
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("impulse_vault")}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                activeTab === "impulse_vault"
                  ? "bg-white text-amber-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ShieldAlert size={12} className="text-amber-500" />
              <span>72h Vault ({coolingItems.length})</span>
            </button>
          </div>
        </div>

        {/* Metric summary ribbon */}
        <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Today's Spend</span>
            <span className="text-lg font-extrabold font-mono text-slate-900">
              ${todayTotal.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleToggleNoSpendDay}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isNoSpendActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700"
              }`}
            >
              <Sparkles size={13} className={isNoSpendActive ? "text-emerald-600 fill-emerald-600" : "text-slate-400"} />
              <span>{isNoSpendActive ? "No-Spend Day Locked ✓" : "Declare No-Spend Day"}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Quick Log Form */}
        {activeTab === "quick_log" && (
          <form onSubmit={handleAddExpense} className="mt-3.5 space-y-3">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4 relative">
                <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400 font-mono">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-6 pr-2 py-1.5 text-xs font-mono font-semibold rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="col-span-8">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Description / Store (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer select-none bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={isImpulse}
                  onChange={(e) => setIsImpulse(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400 h-3 w-3"
                />
                <span>Impulse</span>
              </label>

              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shadow-xs"
              >
                <Plus size={13} />
                <span>Log</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: 72h Impulse Cooling-off Vault */}
        {activeTab === "impulse_vault" && (
          <div className="mt-3.5 space-y-3">
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
              <Clock size={15} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">72-Hour Cooling Rule:</span> Before buying any non-essential item, park it here. 80% of cravings fade within 72 hours, saving you thousands of dollars.
              </div>
            </div>

            {/* Park item mini-form */}
            <form onSubmit={handleCreateImpulseItem} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="grid grid-cols-12 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Item Name (e.g. Wireless Headset)"
                  value={impulseName}
                  onChange={(e) => setImpulseName(e.target.value)}
                  className="col-span-8 px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="$ Price"
                  value={impulsePrice}
                  onChange={(e) => setImpulsePrice(e.target.value)}
                  className="col-span-4 px-2 py-1 text-xs font-mono font-bold rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Reason / Note (optional)"
                  value={impulseNotes}
                  onChange={(e) => setImpulseNotes(e.target.value)}
                  className="flex-1 mr-2 px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 transition-all shadow-xs"
                >
                  Park in 72h Vault
                </button>
              </div>
            </form>

            {/* List of cooling items */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {coolingItems.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  Vault is empty. No compulsive purchases cooling down right now.
                </div>
              ) : (
                coolingItems.map((item) => {
                  const createdAt = new Date(item.createdAt).getTime();
                  const hoursElapsed = Math.floor((Date.now() - createdAt) / (1000 * 60 * 60));
                  const hoursRemaining = Math.max(0, 72 - hoursElapsed);
                  const isReady = hoursRemaining === 0;

                  return (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 truncate">
                          <span>{item.itemName}</span>
                          <span className="font-mono text-amber-600 font-extrabold text-[11px]">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock size={11} className="text-slate-400" />
                          <span>
                            {isReady ? "Cooldown complete! Re-evaluate:" : `${hoursRemaining}h remaining in vault`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleResolveImpulse(item, "resisted_saved")}
                          className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold text-[11px] flex items-center gap-1 transition-all"
                          title="Resisted impulse and saved money"
                        >
                          <CheckCircle2 size={12} />
                          <span>Saved!</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResolveImpulse(item, "bought")}
                          className="px-2 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 font-medium text-[11px]"
                          title="Bought consciously after cooling period"
                        >
                          Bought
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {totalSaved > 0 && (
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center justify-between">
                <span>Total Money Saved by Cooling Vault:</span>
                <span className="font-mono font-extrabold text-emerald-700">${totalSaved.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent logs footer */}
      {expenseLogs.length > 0 && activeTab === "quick_log" && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate max-w-[200px]">
            Latest: <span className="font-medium text-slate-700">{expenseLogs[0].description}</span> (${expenseLogs[0].amount.toFixed(2)})
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            {expenseLogs.length} total logged
          </span>
        </div>
      )}
    </Card>
  );
};
