import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Package, CircleOff, Wallet, QrCode } from "lucide-react";
import {
  formatCurrency,
  formatDate,
  getActivePackage,
  getBillableClassCount,
  getCancelledClassCount,
  getCurrentPackageProgress,
  getRemainingClasses,
  STUDENT_PACKAGES,
} from "@/data/studentPortal";

const StudentPayments = () => {
  const activePackage = getActivePackage();
  const remainingClasses = getRemainingClasses();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-header">Pagamentos</h1>
        <p className="page-subtitle">Cobrança por pacote, saldo de aulas e histórico de Pix.</p>
      </div>

      {remainingClasses <= 1 && (
        <div className="rounded-lg border border-warning/30 bg-warning/10 p-4 mb-6">
          <p className="text-sm font-medium">Seu pacote está quase no fim.</p>
          <p className="text-sm text-muted-foreground mt-1">Você já pode fazer o pagamento do próximo pacote com antecedência.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Aulas restantes" value={remainingClasses} icon={<Package className="w-4 h-4" />} />
        <StatCard label="Aulas cobradas" value={getBillableClassCount()} icon={<CreditCard className="w-4 h-4" />} />
        <StatCard label="Canceladas" value={getCancelledClassCount()} icon={<CircleOff className="w-4 h-4" />} />
        <StatCard label="Pacote ativo" value={formatCurrency(activePackage.amount)} icon={<Wallet className="w-4 h-4" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] mb-6">
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div>
              <h2 className="text-base font-semibold">{activePackage.label}</h2>
              <p className="text-sm text-muted-foreground mt-1">Pago em {formatDate(activePackage.purchasedAt, { year: "numeric" })} via {activePackage.paymentMethod}.</p>
            </div>
            <Badge variant="secondary">{remainingClasses} aula{remainingClasses === 1 ? "" : "s"} restante{remainingClasses === 1 ? "" : "s"}</Badge>
          </div>

          <Progress value={getCurrentPackageProgress()} className="mb-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{getBillableClassCount()} de {activePackage.classesTotal} aulas já cobradas</span>
            <span className="font-medium">{getCurrentPackageProgress()}%</span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5 flex flex-col items-center justify-center text-center">
          <QrCode className="w-12 h-12 text-muted-foreground mb-3" />
          <h2 className="text-base font-semibold mb-1">Pagar via Pix</h2>
          <p className="text-sm text-muted-foreground mb-4">Escaneie o QR Code com o app do seu banco para pagar o próximo pacote.</p>
          <div className="w-40 h-40 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-3">
            <p className="text-xs text-muted-foreground">QR Code será gerado aqui</p>
          </div>
          <p className="text-xs text-muted-foreground">O pagamento é confirmado automaticamente.</p>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold mb-4">Histórico de pacotes</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Pacote</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Compra</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Método</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Valor</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {STUDENT_PACKAGES.map((pkg) => (
                <tr key={pkg.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{pkg.label}</td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{formatDate(pkg.purchasedAt, { year: "numeric" })}</td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{pkg.paymentMethod}</td>
                  <td className="p-3">{formatCurrency(pkg.amount)}</td>
                  <td className="p-3">
                    <Badge variant={pkg.status === "active" ? "default" : "secondary"} className="text-xs">
                      {pkg.status === "active" ? "Ativo" : pkg.status === "completed" ? "Concluído" : "Agendado"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentPayments;