import { useState } from "react";
import { SetupWelcomeScreen } from "@/components/ing/screens/setup/welcome";
import { SetupPinScreen, PinEntryScreen } from "@/components/ing/screens/setup/pin-flow";
import { FaceIDScreen } from "@/components/ing/screens/setup/biometrics";
import { LoginSetupScreen } from "@/components/ing/screens/setup/login-setup";
import { IdentificationMethodScreen } from "@/components/ing/screens/setup/identification";
import { IDPrepScreen, GDPRConsentScreen, IDSelectionScreen } from "@/components/ing/screens/setup/id-verification";
import { IDScanIntroScreen, CameraMockScreen, ProcessingScreen, SuccessScreen, FinalSuccessScreen } from "@/components/ing/screens/setup/scanning-flow";

export function SetupFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<
    "welcome" | 
    "pin-intro" | 
    "pin-entry-1" | 
    "pin-entry-2" | 
    "face-id" | 
    "login" |
    "id-method" |
    "id-prep" |
    "gdpr" |
    "id-select" |
    "scan-intro" |
    "scan-front" |
    "process-front" |
    "success-front" |
    "scan-back" |
    "process-back" |
    "final-success"
  >("welcome");

  const next = (s: typeof step) => setStep(s);

  if (step === "welcome") return <SetupWelcomeScreen onStartSetup={() => next("pin-intro")} />;
  
  if (step === "pin-intro") return <SetupPinScreen onNext={() => next("pin-entry-1")} onCancel={() => next("welcome")} />;
  
  if (step === "pin-entry-1") return <PinEntryScreen title="Wählen Sie Ihre 5-stellige mobilePIN." onNext={() => next("pin-entry-2")} onCancel={() => next("welcome")} />;
  
  if (step === "pin-entry-2") return <PinEntryScreen title="Wiederholen Sie bitte Ihre mobilePIN." onNext={() => next("face-id")} onCancel={() => next("welcome")} />;
  
  if (step === "face-id") return <FaceIDScreen onEnable={() => next("login")} onSkip={() => next("login")} onCancel={() => next("welcome")} />;
  
  if (step === "login") return <LoginSetupScreen onLogin={() => next("id-method")} onCancel={() => next("welcome")} />;

  if (step === "id-method") return <IdentificationMethodScreen onSelectMethod={(m) => m === "id" ? next("id-prep") : alert("SMS flow not implemented")} onCancel={() => next("welcome")} />;

  if (step === "id-prep") return <IDPrepScreen onNext={() => next("gdpr")} onBack={() => next("id-method")} />;

  if (step === "gdpr") return <GDPRConsentScreen onNext={() => next("id-select")} onBack={() => next("id-prep")} />;

  if (step === "id-select") return <IDSelectionScreen onNext={() => next("scan-intro")} onBack={() => next("gdpr")} />;

  if (step === "scan-intro") return <IDScanIntroScreen onNext={() => next("scan-front")} onBack={() => next("id-select")} />;

  if (step === "scan-front") return <CameraMockScreen side="front" onCapture={() => next("process-front")} onBack={() => next("scan-intro")} />;
  
  if (step === "process-front") return <ProcessingScreen onComplete={() => next("success-front")} />;

  if (step === "success-front") return <SuccessScreen onNext={() => next("scan-back")} />;

  if (step === "scan-back") return <CameraMockScreen side="back" onCapture={() => next("process-back")} onBack={() => next("success-front")} />;

  if (step === "process-back") return <ProcessingScreen onComplete={() => next("final-success")} />;

  if (step === "final-success") return <FinalSuccessScreen onFinish={onComplete} />;

  return null;
}
