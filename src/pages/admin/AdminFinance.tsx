import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { DollarSign, Users, TrendingUp, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";

const RATE_PER_CLASS = 50; // R$50 por aula

const TEACHERS = [
  { id: 1, name: "Prof. Maria Silva" },
  { id: 2, name: "Prof. Carlos Oliveira" },
];

// Simulated class logs for the month (presente + ausente count, cancelada não)
const TEACHER_MONTHLY_DATA: Record<string, { teacherId: number; classesGiven: number; classesFaulted: number; classesCancelled: number }[]> = {
  "2026-03": [
    { teacherId: 1, classesGiven: 28, classesFaulted: 3, classesCancelled: 2 },
    { teacherId: 2, classesGiven: 22, classesFaulted: 1, classesCancelled: 1 },
  ],
  "2026-02": [
    { teacherId: 1, classesGiven: 30, classesFaulted: 2, classesCancelled: 3 },
    { teacherId: 2, classesGiven: 24, classesFaulted: 2, classesCancelled: 0 },
  ],
  "2026-01": [
    { teacherId: 1, classesGiven: 26, classesFaulted: 4, classesCancelled: 1 },
    { teacherId: 2, classesGiven: 20, classesFaulted: 1, classesCancelled: 2 },
  ],
};

const MONTHS = [
  { value: "2026-03", label: "Março 2026" },
  { value: "2026-02", label: "Fevereiro 2026" },
  { value: "2026-01", label: "Janeiro 2026" },
];

const AdminFinance = () => {
  const [selectedMonth, setSelectedMonth] = useState("2026-02"); // paga o mês anterior

  const monthData = TEACHER_MONTHLY_DATA[selectedMonth] || [];

  const teacherPayments = useMemo(() => {
    return monthData.map((data) => {
      const teacher = TEACHERS.find((t) => t.id === data.teacherId);
      const billableClasses = data.classesGiven + data.classesFaulted; // cancelada não conta
      const totalPayment = billableClasses * RATE_PER_CLASS;
      return {
        ...data,
        name: teacher?.name || "—",
        billableClasses,
        totalPayment,
      };
    });
  }, [monthData]);

  const totalToPay = teacherPayments.reduce((sum, t) => sum + t.totalPayment, 0);
  const totalClasses = teacherPayments.reduce((sum, t) => sum + t.billableClasses, 0);

  const currentMonthIdx = MONTHS.findIndex((m) => m.value === selectedMonth);
  const currentMonthLabel = MONTHS[currentMonthIdx]?.label || selectedMonth;

  const goBack = () => {
    if (currentMonthIdx < MONTHS.length - 1) setSelectedMonth(MONTHS[currentMonthIdx + 1].value);
  };
  const goForward = () => {
    if (currentMonthIdx > 0) setSelectedMonth(MONTHS[currentMonthIdx - 1].value);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header">Financeiro — Teachers</h1>
          <p className="page-subtitle">Pagamento do mês anterior · Dia 1º</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </div>

      {/* Month selector */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="icon" onClick={goBack} disabled={currentMonthIdx >= MONTHS.length - 1}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="px-4 py-2 rounded-lg border bg-card text-sm font-medium min-w-[160px] text-center">
          {currentMonthLabel}
        </div>
        <Button variant="outline" size="icon" onClick={goForward} disabled={currentMonthIdx <= 0}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total a pagar"
          value={`R$${totalToPay.toLocaleString("pt-BR")}`}
          icon={<DollarSign className="w-4 h-4" />}
        />
        <StatCard
          label="Total de aulas cobráveis"
          value={totalClasses}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          label="Valor por aula"
          value={`R$${RATE_PER_CLASS}`}
          icon={<Users className="w-4 h-4" />}
        />
      </div>

      {/* Info box */}
      <div className="p-4 rounded-lg border bg-muted/30 mb-6">
        <p className="text-xs text-muted-foreground">
          <strong>Regra de cálculo:</strong> Aulas com <Badge variant="default" className="text-[10px] mx-1">Presente</Badge> 
          e <Badge variant="destructive" className="text-[10px] mx-1">Ausente</Badge> são cobráveis. 
          Aulas <Badge variant="secondary" className="text-[10px] mx-1">Canceladas</Badge> pelo aluno com aviso não são cobradas do pacote nem pagas ao teacher.
        </p>
      </div>

      {/* Teacher payment table */}
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Teacher</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Presença</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Ausência</th>
              <th className="text-center p-3 font-medium text-muted-foreground hidden md:table-cell">Canceladas</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Cobráveis</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
            </tr>
          </thead>
          <tbody>
            {teacherPayments.map((t) => (
              <tr key={t.teacherId} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-3 font-medium">{t.name}</td>
                <td className="p-3 text-center">
                  <Badge variant="default" className="text-xs">{t.classesGiven}</Badge>
                </td>
                <td className="p-3 text-center">
                  <Badge variant="destructive" className="text-xs">{t.classesFaulted}</Badge>
                </td>
                <td className="p-3 text-center hidden md:table-cell">
                  <Badge variant="secondary" className="text-xs">{t.classesCancelled}</Badge>
                </td>
                <td className="p-3 text-center font-semibold">{t.billableClasses}</td>
                <td className="p-3 text-right font-semibold">
                  R${t.totalPayment.toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/50 border-t">
              <td className="p-3 font-semibold">Total</td>
              <td className="p-3 text-center font-semibold">{teacherPayments.reduce((s, t) => s + t.classesGiven, 0)}</td>
              <td className="p-3 text-center font-semibold">{teacherPayments.reduce((s, t) => s + t.classesFaulted, 0)}</td>
              <td className="p-3 text-center font-semibold hidden md:table-cell">{teacherPayments.reduce((s, t) => s + t.classesCancelled, 0)}</td>
              <td className="p-3 text-center font-semibold">{totalClasses}</td>
              <td className="p-3 text-right font-bold text-base">R${totalToPay.toLocaleString("pt-BR")}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminFinance;
