import { ScreenHeader, BottomNav, INGButton } from "../layout";
import { Screen } from "@/pages/ing-app";
import { Mail, CreditCard, User, Settings, LogOut, ChevronRight, Shield, FileText, HelpCircle, MessageSquare, Info, Smartphone, Camera, X, Check, Lock, Eye, EyeOff, Phone, AlertTriangle, ExternalLink, Star, Send } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppSettingsScreen } from "./settings/app-settings";
import { PersonalDataScreen } from "./settings/personal-data";

type SubScreen = "none" | "app-settings" | "personal-data" | "postbox" | "cards" | "security" | "templates" | "help" | "feedback";

export function ServiceScreen({ onBack, onLogout, onNavigate }: { onBack: () => void; onLogout: () => void; onNavigate: (s: Screen) => void }) {
  const [subScreen, setSubScreen] = useState<SubScreen>("none");

  if (subScreen === "app-settings") {
    return <AppSettingsScreen onBack={() => setSubScreen("none")} />;
  }

  if (subScreen === "personal-data") {
    return <PersonalDataScreen onBack={() => setSubScreen("none")} />;
  }

  if (subScreen === "postbox") {
    return <PostBoxScreen onBack={() => setSubScreen("none")} />;
  }

  if (subScreen === "cards") {
    return <CardsScreen onBack={() => setSubScreen("none")} />;
  }

  if (subScreen === "security") {
    return <SecurityScreen onBack={() => setSubScreen("none")} />;
  }

  if (subScreen === "templates") {
    return <TemplatesScreen onBack={() => setSubScreen("none")} />;
  }

  if (subScreen === "help") {
    return <HelpScreen onBack={() => setSubScreen("none")} />;
  }

  if (subScreen === "feedback") {
    return <FeedbackScreen onBack={() => setSubScreen("none")} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <div className="px-6 pt-12 pb-6 bg-white">
         <h1 className="text-3xl font-bold text-[#333333] mb-6">Service</h1>
         
         <div className="flex items-center justify-between">
           <div>
             <div className="text-xs text-gray-500 mb-1">Zugang verwalten für</div>
             <div className="font-bold text-lg flex items-center gap-2">
               Maxi Mustermensch <ChevronRight size={16} className="rotate-90" />
             </div>
           </div>
           <button onClick={onLogout} className="text-[#FF6200]" title="Logout">
             <LogOut size={24} />
           </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
         <div className="p-4 space-y-4">
            <ServiceCard 
                icon={<Mail size={24} className="text-[#FF6200]" />}
                title="Post-Box"
                subtitle="Kontoauszüge, Zinserträge"
                badge="8"
                onClick={() => setSubScreen("postbox")}
            />
            
            <ServiceCard 
                icon={<CreditCard size={24} className="text-[#FF6200]" />}
                title="Karten"
                subtitle="Sperren, Limits, PIN, Umsätze"
                onClick={() => setSubScreen("cards")}
            />

            <h3 className="text-[#FF6200] text-lg font-normal mt-8 mb-2 px-2">Meine Daten und Einstellungen</h3>
            
            <div className="bg-white rounded-xl divide-y divide-gray-100 overflow-hidden">
                <ServiceRow 
                  icon={<User size={20} className="text-[#FF6200]" />}
                  title="Persönliche Daten"
                  subtitle="Adresse, Kontaktdaten, Steuerinformation"
                  onClick={() => setSubScreen("personal-data")}
                />
                <ServiceRow 
                  icon={<Settings size={20} className="text-[#FF6200]" />}
                  title="Konto verwalten"
                  subtitle="Verwaltung, Einstellungen, Aufträge"
                  onClick={() => setSubScreen("app-settings")}
                />
                <ServiceRow 
                  icon={<Settings size={20} className="text-[#FF6200]" />}
                  title="App-Einstellungen"
                  subtitle="Benachrichtigungen, App anpassen"
                  onClick={() => setSubScreen("app-settings")}
                />
                <ServiceRow 
                  icon={<Shield size={20} className="text-[#FF6200]" />}
                  title="Login und Sicherheit"
                  subtitle="mobilePIN, weitere Geräte, internetbanking PIN"
                  onClick={() => setSubScreen("security")}
                />
            </div>

            <h3 className="text-[#FF6200] text-lg font-normal mt-8 mb-2 px-2">Funktionen verwalten</h3>
            
            <div className="bg-white rounded-xl divide-y divide-gray-100 overflow-hidden">
                <ServiceRow 
                  icon={<Info size={20} className="text-[#FF6200]" />}
                  title="Überweisungsvorlagen"
                  subtitle=""
                  onClick={() => setSubScreen("templates")}
                />
                <ServiceRow 
                  icon={<Camera size={20} className="text-[#FF6200]" />}
                  title="Fotoüberweisung"
                  subtitle=""
                  onClick={() => setSubScreen("help")}
                />
                <ServiceRow 
                  icon={<FileText size={20} className="text-[#FF6200]" />}
                  title="Freistellungsauftrag"
                  subtitle=""
                  onClick={() => setSubScreen("help")}
                />
            </div>

            <h3 className="text-[#FF6200] text-lg font-normal mt-8 mb-2 px-2">Hilfe und Feedback</h3>
            
            <div className="bg-white rounded-xl divide-y divide-gray-100 overflow-hidden">
                <ServiceRow 
                  icon={<HelpCircle size={20} className="text-[#FF6200]" />}
                  title="Hilfe"
                  subtitle=""
                  onClick={() => setSubScreen("help")}
                />
                <ServiceRow 
                  icon={<MessageSquare size={20} className="text-[#FF6200]" />}
                  title="Feedback an die ING"
                  subtitle=""
                  onClick={() => setSubScreen("feedback")}
                />
                <ServiceRow 
                  icon={<Info size={20} className="text-[#FF6200]" />}
                  title="Rechtliches und Datenschutz"
                  subtitle=""
                  onClick={() => setSubScreen("help")}
                />
            </div>

            <div className="mt-8 mb-4">
               <button onClick={onLogout} className="w-full py-3 border-2 border-[#FF6200] rounded-lg text-[#FF6200] font-bold flex items-center justify-center gap-2 hover:bg-orange-50">
                  <LogOut size={20} /> Logout
               </button>
               <p className="text-xs text-gray-500 mt-2 text-center leading-relaxed">
                 Zur Sicherheit werden Sie automatisch nach 2 Minuten abgemeldet.
               </p>
            </div>

            <div className="bg-gray-200/50 rounded-lg p-4 flex items-center gap-3 justify-center mb-8">
               <div className="w-8 h-8 bg-gray-300/50 rounded-full flex items-center justify-center">🦁</div>
               <span className="text-gray-500 text-sm font-medium">App-Version 8.20.0</span>
            </div>
         </div>
      </div>

      <BottomNav activeTab="service" onNavigate={onNavigate} profile="adult" />
    </div>
  );
}

function ServiceCard({ icon, title, subtitle, badge, onClick }: { icon: React.ReactNode; title: string; subtitle: string; badge?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full bg-white p-5 rounded-xl flex items-center gap-4 shadow-sm cursor-pointer active:scale-[0.98] transition-transform border border-transparent hover:border-gray-100 text-left">
       <div className="shrink-0">{icon}</div>
       <div className="flex-1">
          <div className="font-bold text-[#333333] flex items-center justify-between">
            {title}
            {badge && <span className="bg-[#33307E] text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>}
          </div>
          <div className="text-xs text-gray-500">{subtitle}</div>
       </div>
       <ChevronRight size={20} className="text-gray-400" />
    </button>
  );
}

function ServiceRow({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 text-left">
       <div className="shrink-0 w-8">{icon}</div>
       <div className="flex-1">
          <div className="font-medium text-[#333333]">{title}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
       </div>
       <ChevronRight size={20} className="text-gray-400" />
    </button>
  );
}

// Post-Box Screen
function PostBoxScreen({ onBack }: { onBack: () => void }) {
  const documents = [
    { id: 1, title: "Kontoauszug November 2025", date: "01.12.2025", type: "statement", unread: true },
    { id: 2, title: "Zinsgutschrift Extra-Konto", date: "30.11.2025", type: "interest", unread: true },
    { id: 3, title: "Kontoauszug Oktober 2025", date: "01.11.2025", type: "statement", unread: false },
    { id: 4, title: "Depot-Abrechnung Q3", date: "15.10.2025", type: "depot", unread: false },
    { id: 5, title: "Kontoauszug September 2025", date: "01.10.2025", type: "statement", unread: false },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <div className="h-14 px-4 flex items-center gap-4 bg-white border-b border-gray-100">
        <button onClick={onBack} className="text-[#FF6200]" aria-label="Zurück">
          <X size={24} />
        </button>
        <h1 className="text-lg font-bold text-[#333333]">Post-Box</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {documents.map((doc) => (
          <button 
            key={doc.id}
            className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              doc.unread ? "bg-[#FF6200]" : "bg-gray-100"
            }`}>
              <FileText size={20} className={doc.unread ? "text-white" : "text-gray-500"} />
            </div>
            <div className="flex-1">
              <div className={`font-medium text-sm ${doc.unread ? "text-[#333333]" : "text-gray-600"}`}>
                {doc.title}
              </div>
              <div className="text-xs text-gray-400">{doc.date}</div>
            </div>
            {doc.unread && (
              <div className="w-2 h-2 bg-[#FF6200] rounded-full" />
            )}
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
}

// Cards Screen
function CardsScreen({ onBack }: { onBack: () => void }) {
  const [showPIN, setShowPIN] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <div className="h-14 px-4 flex items-center gap-4 bg-white border-b border-gray-100">
        <button onClick={onBack} className="text-[#FF6200]" aria-label="Zurück">
          <X size={24} />
        </button>
        <h1 className="text-lg font-bold text-[#333333]">Karten</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Girocard */}
        <div className="bg-gradient-to-br from-[#33307E] to-[#1a1850] p-6 rounded-2xl text-white shadow-lg">
          <div className="flex justify-between items-start mb-8">
            <div className="text-sm opacity-80">Girocard</div>
            <div className="text-xs bg-white/20 px-2 py-1 rounded">Aktiv</div>
          </div>
          <div className="font-mono text-lg tracking-wider mb-4">•••• •••• •••• 4521</div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs opacity-60">Inhaber</div>
              <div className="text-sm">Maxi Mustermensch</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-60">Gültig bis</div>
              <div className="text-sm">12/28</div>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="bg-white rounded-xl divide-y divide-gray-100 overflow-hidden">
          <button className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50">
            <Lock size={20} className="text-[#FF6200]" />
            <div className="flex-1">
              <div className="font-medium text-[#333333]">Karte sperren</div>
              <div className="text-xs text-gray-500">Temporär oder dauerhaft</div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button 
            onClick={() => setShowPIN(!showPIN)}
            className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50"
          >
            {showPIN ? <EyeOff size={20} className="text-[#FF6200]" /> : <Eye size={20} className="text-[#FF6200]" />}
            <div className="flex-1">
              <div className="font-medium text-[#333333]">PIN anzeigen</div>
              {showPIN && <div className="text-lg font-mono text-[#FF6200] mt-1">1234</div>}
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50">
            <Settings size={20} className="text-[#FF6200]" />
            <div className="flex-1">
              <div className="font-medium text-[#333333]">Limits anpassen</div>
              <div className="text-xs text-gray-500">Täglich: 1.000€ • Wöchentlich: 2.500€</div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* VISA Card */}
        <div className="bg-gradient-to-br from-[#FF6200] to-[#FF8F00] p-6 rounded-2xl text-white shadow-lg">
          <div className="flex justify-between items-start mb-8">
            <div className="text-sm opacity-80">VISA Debit</div>
            <div className="text-xs bg-white/20 px-2 py-1 rounded">Aktiv</div>
          </div>
          <div className="font-mono text-lg tracking-wider mb-4">•••• •••• •••• 7892</div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs opacity-60">Inhaber</div>
              <div className="text-sm">Maxi Mustermensch</div>
            </div>
            <div className="text-2xl font-bold italic">VISA</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Security Screen
function SecurityScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <div className="h-14 px-4 flex items-center gap-4 bg-white border-b border-gray-100">
        <button onClick={onBack} className="text-[#FF6200]" aria-label="Zurück">
          <X size={24} />
        </button>
        <h1 className="text-lg font-bold text-[#333333]">Login und Sicherheit</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Security Status */}
        <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Shield size={20} className="text-green-600" />
          </div>
          <div>
            <div className="font-bold text-green-700">Konto gesichert</div>
            <div className="text-xs text-green-600">Alle Sicherheitseinstellungen aktiv</div>
          </div>
        </div>

        <div className="bg-white rounded-xl divide-y divide-gray-100 overflow-hidden">
          <button className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50">
            <Lock size={20} className="text-[#FF6200]" />
            <div className="flex-1">
              <div className="font-medium text-[#333333]">mobilePIN ändern</div>
              <div className="text-xs text-gray-500">5-stellige PIN für App-Zugang</div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50">
            <Smartphone size={20} className="text-[#FF6200]" />
            <div className="flex-1">
              <div className="font-medium text-[#333333]">Angemeldete Geräte</div>
              <div className="text-xs text-gray-500">2 Geräte aktiv</div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50">
            <Shield size={20} className="text-[#FF6200]" />
            <div className="flex-1">
              <div className="font-medium text-[#333333]">Internetbanking PIN</div>
              <div className="text-xs text-gray-500">Zuletzt geändert: vor 3 Monaten</div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50">
            <Eye size={20} className="text-[#FF6200]" />
            <div className="flex-1">
              <div className="font-medium text-[#333333]">Face ID / Touch ID</div>
              <div className="text-xs text-green-600">Aktiviert</div>
            </div>
            <div className="w-10 h-6 bg-green-500 rounded-full flex items-center px-1">
              <div className="w-4 h-4 bg-white rounded-full ml-auto" />
            </div>
          </button>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-700 text-sm">Sicherheitstipp</div>
            <p className="text-xs text-amber-600 mt-1">
              Teile niemals deine PIN oder Zugangsdaten mit anderen. Die ING wird dich niemals danach fragen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Templates Screen
function TemplatesScreen({ onBack }: { onBack: () => void }) {
  const templates = [
    { name: "Andreas Mustermann", iban: "DE10 1234 5678 1234 5678 91", usage: "Mietanteil" },
    { name: "Martin Müller", iban: "DE34 1234 5678 1234 5678 01", usage: "Gemeinsame Ausgaben" },
    { name: "Marios Pizza", iban: "DE45 1234 5678 1234 5678 91", usage: "Bestellung" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <div className="h-14 px-4 flex items-center gap-4 bg-white border-b border-gray-100">
        <button onClick={onBack} className="text-[#FF6200]" aria-label="Zurück">
          <X size={24} />
        </button>
        <h1 className="text-lg font-bold text-[#333333]">Überweisungsvorlagen</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {templates.map((t, idx) => (
          <button 
            key={idx}
            className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 text-left hover:bg-gray-50"
          >
            <div className="w-10 h-10 bg-[#FF6200] rounded-full flex items-center justify-center text-white font-bold">
              {t.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm text-[#333333]">{t.name}</div>
              <div className="text-xs text-gray-500">{t.usage}</div>
              <div className="text-xs text-gray-400 font-mono mt-1">{t.iban}</div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        ))}

        <button className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-center gap-2 text-[#FF6200] font-bold hover:bg-orange-50">
          <span className="text-2xl">+</span>
          <span>Neue Vorlage erstellen</span>
        </button>
      </div>
    </div>
  );
}

// Help Screen
function HelpScreen({ onBack }: { onBack: () => void }) {
  const faqs = [
    { q: "Wie ändere ich meine Adresse?", a: "Unter Service → Persönliche Daten → Adresse" },
    { q: "Wie sperre ich meine Karte?", a: "Unter Service → Karten → Karte sperren" },
    { q: "Wie erreiche ich den Kundenservice?", a: "069 / 34 22 24 oder via Chat" },
    { q: "Wie funktioniert die Fotoüberweisung?", a: "Fotografiere eine Rechnung und Leo füllt die Daten aus" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <div className="h-14 px-4 flex items-center gap-4 bg-white border-b border-gray-100">
        <button onClick={onBack} className="text-[#FF6200]" aria-label="Zurück">
          <X size={24} />
        </button>
        <h1 className="text-lg font-bold text-[#333333]">Hilfe</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Contact Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="font-bold text-[#333333] mb-3">Kundenservice kontaktieren</div>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-[#FF6200]/10 rounded-xl flex items-center gap-2 text-[#FF6200] font-medium">
              <Phone size={20} />
              <span>Anrufen</span>
            </button>
            <button className="p-3 bg-[#FF6200]/10 rounded-xl flex items-center gap-2 text-[#FF6200] font-medium">
              <MessageSquare size={20} />
              <span>Chat</span>
            </button>
          </div>
        </div>

        {/* FAQs */}
        <div className="font-bold text-[#333333] px-2">Häufige Fragen</div>
        <div className="bg-white rounded-xl divide-y divide-gray-100 overflow-hidden">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4">
              <div className="font-medium text-[#333333] text-sm mb-1">{faq.q}</div>
              <div className="text-xs text-gray-500">{faq.a}</div>
            </div>
          ))}
        </div>

        <button className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-center gap-2 text-[#FF6200] font-bold hover:bg-orange-50">
          <ExternalLink size={18} />
          <span>Alle FAQ ansehen</span>
        </button>
      </div>
    </div>
  );
}

// Feedback Screen
function FeedbackScreen({ onBack }: { onBack: () => void }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col bg-white items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <Check size={40} className="text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-[#333333] mb-2">Vielen Dank!</h2>
        <p className="text-gray-500 text-center mb-6">
          Dein Feedback hilft uns, die App zu verbessern.
        </p>
        <button 
          onClick={onBack}
          className="w-full py-3 bg-[#FF6200] text-white font-bold rounded-lg hover:bg-[#e55800]"
        >
          Zurück
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <div className="h-14 px-4 flex items-center gap-4 bg-white border-b border-gray-100">
        <button onClick={onBack} className="text-[#FF6200]" aria-label="Zurück">
          <X size={24} />
        </button>
        <h1 className="text-lg font-bold text-[#333333]">Feedback</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Rating */}
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="font-bold text-[#333333] mb-4">Wie gefällt dir die ING App?</div>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star}
                onClick={() => setRating(star)}
                className="p-2"
                title={`${star} Stern${star > 1 ? 'e' : ''}`}
              >
                <Star 
                  size={32} 
                  className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Text */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <label className="font-bold text-[#333333] block mb-2">Dein Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Was können wir verbessern?"
            className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:border-[#FF6200] focus:ring-1 focus:ring-[#FF6200] outline-none"
          />
        </div>

        <button 
          onClick={() => setSubmitted(true)}
          disabled={rating === 0}
          className="w-full py-3 bg-[#FF6200] text-white font-bold rounded-lg hover:bg-[#e55800] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send size={18} />
          Feedback senden
        </button>
      </div>
    </div>
  );
}
