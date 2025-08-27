import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider, useUser } from "@/contexts/UserContext";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import ProfilePage from "@/pages/ProfilePage";
import NewsPage from "@/pages/NewsPage";
import GunStorePage from "@/pages/GunStorePage";
import RealEstatePage from "@/pages/RealEstatePage";
import AircraftPage from "@/pages/AircraftPage";
import DatingPage from "@/pages/DatingPage";
import StockTradingPage from "@/pages/StockTradingPage";
import LotteryPage from "@/pages/LotteryPage";
import AdminPage from "@/pages/AdminPage";
import CreatorPage from "@/pages/CreatorPage";
import ModelsPage from "@/pages/ModelsPage";
import FunPage from "@/pages/FunPage";
import VehiclesPage from "@/pages/VehiclesPage";
import BettingPage from "@/pages/BettingPage";
import TruckingPage from "@/pages/TruckingPage";
import WeatherPage from "@/pages/WeatherPage";
import { TopProgressBar } from "@/components/TopProgressBar";
import { BottomNavigation } from "@/components/BottomNavigation";

function AuthenticatedApp() {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopProgressBar />
      <div className="pt-24 pb-20">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/news" component={NewsPage} />
          <Route path="/gun-store" component={GunStorePage} />
          <Route path="/real-estate" component={RealEstatePage} />
          <Route path="/aircraft" component={AircraftPage} />
          <Route path="/dating" component={DatingPage} />
          <Route path="/stocks" component={StockTradingPage} />
          <Route path="/lottery" component={LotteryPage} />
          <Route path="/creators" component={CreatorPage} />
          <Route path="/models" component={ModelsPage} />
          <Route path="/fun" component={FunPage} />
          <Route path="/vehicles" component={VehiclesPage} />
          <Route path="/betting" component={BettingPage} />
          <Route path="/trucking" component={TruckingPage} />
          <Route path="/weather" component={WeatherPage} />
          <Route path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <Toaster />
          <AuthenticatedApp />
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
