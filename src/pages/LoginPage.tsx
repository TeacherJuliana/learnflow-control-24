import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Shield, BookOpen } from "lucide-react";

const ROLES: { role: UserRole; label: string; desc: string; icon: React.ElementType; path: string }[] = [
  { role: "admin", label: "Admin", desc: "Gestão completa da plataforma", icon: Shield, path: "/admin" },
  { role: "teacher", label: "Teacher", desc: "Agenda, alunos e pós-aula", icon: GraduationCap, path: "/teacher" },
  { role: "student", label: "Student", desc: "Aulas, materiais e pagamentos", icon: BookOpen, path: "/student" },
];

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole, path: string) => {
    login(role);
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">EduFlow</h1>
          <p className="text-muted-foreground mt-2 text-sm">Plataforma de gestão educacional</p>
        </div>

        <div className="space-y-3">
          {ROLES.map(({ role, label, desc, icon: Icon, path }) => (
            <button
              key={role}
              onClick={() => handleLogin(role, path)}
              className="w-full flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8">
          Demo — selecione um perfil para entrar
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
