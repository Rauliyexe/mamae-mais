import React from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import { Bell, CheckCheck, Trash2, Trophy, Calendar, BookHeart, Activity, Sparkles } from "lucide-react";

const ICONS = {
  health: Activity,
  diary: BookHeart,
  calendar: Calendar,
  achievement: Trophy,
  week: Sparkles,
};

export default function Notificacoes() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications, navigate, unreadCount } = useApp();

  const handleTap = (notif) => {
    markNotificationRead(notif.id);
    if (notif.targetScreen) navigate(notif.targetScreen);
  };

  return (
    <div className="w-full min-h-full pb-8 font-albert animate-fadeIn bg-[#FDF5F8]">
      <TopBar title="Notificações" showBack={true} />

      {/* Actions Bar */}
      <div className="px-5 -mt-4 relative z-10">
        <div className="bg-white rounded-card p-3 shadow-mamae border border-[#F0DDE4] flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#3D2B33]">
            {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}` : "Tudo lido ✨"}
          </span>
          <div className="flex gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-[10px] font-bold text-[#D4638F] flex items-center gap-1 bg-[#FBE8EF] px-3 py-1.5 rounded-full hover:bg-[#F0DDE4] transition cursor-pointer"
            >
              <CheckCheck size={12} /> Ler todas
            </button>
            <button
              onClick={clearNotifications}
              className="text-[10px] font-bold text-[#8C6B7A] flex items-center gap-1 bg-[#8C6B7A]/5 px-3 py-1.5 rounded-full hover:bg-[#8C6B7A]/15 transition cursor-pointer"
            >
              <Trash2 size={12} /> Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="px-5 mt-4 space-y-2.5">
        {notifications.length > 0 ? (
          notifications.map((notif) => {
            const IconComp = ICONS[notif.type] || Bell;
            return (
              <button
                key={notif.id}
                onClick={() => handleTap(notif)}
                className={`w-full text-left bg-white rounded-card p-4 shadow-mamae border flex items-start gap-3.5 transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                  notif.read ? "border-[#F0DDE4] opacity-70" : "border-[#D4638F]/20 bg-[#FBE8EF]/20"
                }`}
              >
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  notif.read ? "bg-[#F0DDE4]/50 text-[#8C6B7A]" : "bg-[#FBE8EF] text-[#D4638F]"
                }`}>
                  <IconComp size={16} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[12.5px] font-bold text-[#3D2B33] font-poppins truncate">
                    {notif.title}
                  </h4>
                  <p className="text-[11px] text-[#8C6B7A] mt-0.5 leading-relaxed font-medium line-clamp-2">
                    {notif.body}
                  </p>
                  <span className="text-[9px] text-[#B8A0AB] font-bold mt-1 block">{notif.date}</span>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-[#D4638F] shrink-0 mt-1.5 animate-pulse" />
                )}
              </button>
            );
          })
        ) : (
          <div className="bg-white rounded-card p-8 shadow-mamae border border-[#F0DDE4] text-center">
            <div className="text-[32px] mb-2">🔔</div>
            <p className="text-[13px] text-[#3D2B33] font-bold font-poppins">Nenhuma notificação</p>
            <p className="text-[11px] text-[#8C6B7A] mt-1 font-medium">
              Suas notificações de saúde e lembretes aparecerão aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
