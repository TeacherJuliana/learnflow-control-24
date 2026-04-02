import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentClasses from "./pages/student/StudentClasses";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminWaitingList from "./pages/admin/AdminWaitingList";
import StudentMaterials from "./pages/student/StudentMaterials";
import StudentNotices from "./pages/student/StudentNotices";
import StudentPayments from "./pages/student/StudentPayments";
import StudentProfile from "./pages/student/StudentProfile";
import TeacherSchedule from "./pages/teacher/TeacherSchedule";
import AdminFinance from "./pages/admin/AdminFinance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/classes" element={<StudentClasses />} />
            <Route path="/student/materials" element={<StudentMaterials />} />
            <Route path="/student/notices" element={<StudentNotices />} />
            <Route path="/student/payments" element={<StudentPayments />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/schedule" element={<TeacherSchedule />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/waiting-list" element={<AdminWaitingList />} />
            <Route path="/admin/finance" element={<AdminFinance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
