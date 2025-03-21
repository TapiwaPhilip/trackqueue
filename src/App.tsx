
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ClubsProvider } from "./context/ClubsContext";
import Index from "./pages/Index";
import AddClub from "./pages/AddClub";
import ClubDetail from "./components/ClubDetail";
import NotFound from "./pages/NotFound";
import LogoFavicon from "./components/LogoFavicon";

// Configure the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = React.memo(() => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LogoFavicon />
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ClubsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/club/:id" element={<ClubDetail />} />
              <Route path="/add-club" element={<AddClub />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ClubsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
));

export default App;
