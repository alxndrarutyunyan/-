import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { TelegramSimulator } from "./components/TelegramSimulator";
import { PriceCalculator } from "./components/PriceCalculator";
import { RulesAndFaq } from "./components/RulesAndFaq";
import { BookingsInbox } from "./components/BookingsInbox";
import { BotSetupModal } from "./components/BotSetupModal";
import { BookingModal } from "./components/BookingModal";
import { BotStatusInfo, BookingRequest } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"simulator" | "calculator" | "rules" | "bookings">("simulator");
  
  const [botStatus, setBotStatus] = useState<BotStatusInfo>({
    tokenConfigured: false,
    botUsername: "",
    botFirstName: "",
    isPollingActive: false,
  });

  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isBotSetupOpen, setIsBotSetupOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedPackage, setPreselectedPackage] = useState<string>("8 занятий в месяц (2 раз/нед), 60 мин");
  const [preselectedPrice, setPreselectedPrice] = useState<number>(15000);

  // Fetch initial bot status
  const fetchBotInfo = async () => {
    try {
      const res = await fetch("/api/bot/info");
      if (res.ok) {
        const data = await res.json();
        setBotStatus(data);
      }
    } catch (e) {
      console.error("Failed to fetch bot info:", e);
    }
  };

  // Fetch bookings list
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error("Failed to fetch bookings:", e);
    }
  };

  useEffect(() => {
    fetchBotInfo();
    fetchBookings();
  }, []);

  const handleOpenBookingForPackage = (pkgDetails?: string, price?: number) => {
    if (pkgDetails) setPreselectedPackage(pkgDetails);
    if (price) setPreselectedPrice(price);
    setIsBookingModalOpen(true);
  };

  const handleUpdateBookingStatus = async (id: string, status: BookingRequest["status"]) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (e) {
      console.error("Failed to update booking status:", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        botStatus={botStatus}
        onOpenBotSetup={() => setIsBotSetupOpen(true)}
        bookingsCount={bookings.filter((b) => b.status === "new").length}
      />

      {/* Main Content View */}
      <main className="pb-16">
        {activeTab === "simulator" && (
          <TelegramSimulator
            onOpenBookingModal={handleOpenBookingForPackage}
            botUsername={botStatus.botUsername}
          />
        )}

        {activeTab === "calculator" && (
          <PriceCalculator
            onSelectForBooking={(details, price) => {
              handleOpenBookingForPackage(details, price);
            }}
          />
        )}

        {activeTab === "rules" && (
          <RulesAndFaq
            onOpenBookingModal={() => handleOpenBookingForPackage()}
          />
        )}

        {activeTab === "bookings" && (
          <BookingsInbox
            bookings={bookings}
            onUpdateStatus={handleUpdateBookingStatus}
            onOpenNewModal={() => handleOpenBookingForPackage()}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Обучение с Александром • Официальный Телеграм-Бот</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Яндекс Телемост</span>
            <span>•</span>
            <a href="https://t.me/alxndr_artnn" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
              Telegram: @alxndr_artnn
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BotSetupModal
        isOpen={isBotSetupOpen}
        onClose={() => setIsBotSetupOpen(false)}
        botStatus={botStatus}
        onUpdateStatus={(info) => setBotStatus(info)}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedPackage={preselectedPackage}
        preselectedPrice={preselectedPrice}
        onBookingCreated={() => {
          fetchBookings();
        }}
      />
    </div>
  );
}
