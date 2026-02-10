import { useState } from "react";
import { INGApp } from "@/pages/ing-app";
import { UkrainianDemoPage } from "@/pages/ukrainian-demo";
import { AccessibilityDemoPage } from "@/pages/accessibility-demo";
import { ParentDashboardDemoPage } from "@/pages/parent-dashboard-demo";
import { FrictionDemoPage } from "@/pages/friction-demo";
import { BirthdayTransitionDemoPage } from "@/pages/birthday-transition-demo";
import { AIAgentDemoPage } from "@/pages/ai-agent-demo";
import { PitchDemoVideo } from "@/pages/pitch-demo";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

function Router() {
  return (
    <Switch>
      <Route path="/" component={INGApp} />
      <Route path="/demo/ukrainian" component={UkrainianDemoPage} />
      <Route path="/demo/accessibility" component={AccessibilityDemoPage} />
      <Route path="/demo/parent" component={ParentDashboardDemoPage} />
      <Route path="/demo/friction" component={FrictionDemoPage} />
      <Route path="/demo/birthday" component={BirthdayTransitionDemoPage} />
      <Route path="/demo/ai-agent" component={AIAgentDemoPage} />
      <Route path="/demo/pitch" component={PitchDemoVideo} />
      <Route>404 Page Not Found</Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
