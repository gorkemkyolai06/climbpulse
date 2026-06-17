import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `%${value}`;
}

const WALL_ZONE_STATUS: Record<string, string> = {
  available: 'Müsait',
  in_use: 'Tırmanışta',
  reset_in_progress: 'Reset',
  closed: 'Kapalı',
};

export function formatWallZoneStatus(status: string): string {
  return WALL_ZONE_STATUS[status] || status;
}

const WALL_ZONE_TYPE: Record<string, string> = {
  boulder: 'Boulder',
  top_rope: 'Top Rope',
  lead: 'Lead',
  training: 'Antrenman',
  auto_belay: 'Auto Belay',
};

export function formatWallZoneType(type: string): string {
  return WALL_ZONE_TYPE[type] || type;
}

const SESSION_STATUS: Record<string, string> = {
  recorded: 'Kayıtlı',
  verified: 'Doğrulandı',
  disputed: 'İtirazlı',
};

export function formatSessionStatus(status: string): string {
  return SESSION_STATUS[status] || status;
}

const ROUTE_SETTING_STATUS: Record<string, string> = {
  open: 'Açık',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
};

export function formatRouteSettingStatus(status: string): string {
  return ROUTE_SETTING_STATUS[status] || status;
}

const ROUTE_SETTING_PRIORITY: Record<string, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  urgent: 'Acil',
};

export function formatRouteSettingPriority(priority: string): string {
  return ROUTE_SETTING_PRIORITY[priority] || priority;
}

const ROTATION_STATUS: Record<string, string> = {
  scheduled: 'Planlandı',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  overdue: 'Gecikmiş',
};

export function formatRotationStatus(status: string): string {
  return ROTATION_STATUS[status] || status;
}

const ROTATION_CATEGORY: Record<string, string> = {
  full_reset: 'Tam Reset',
  partial_reset: 'Kısmi Reset',
  hold_inspection: 'Tutamak Kontrolü',
  wall_cleaning: 'Duvar Temizliği',
  anchor_check: 'Ankraj Kontrolü',
  other: 'Diğer',
};

export function formatRotationCategory(category: string): string {
  return ROTATION_CATEGORY[category] || category;
}

const GEAR_CATEGORY: Record<string, string> = {
  harness: 'Emniyet Kemeri',
  rope: 'Halat',
  shoes: 'Ayakkabı',
  chalk_bag: 'Magnesium Çantası',
  crash_pad: 'Crash Pad',
  belay_device: 'Güvenlik Cihazı',
  other: 'Diğer',
};

export function formatGearCategory(category: string): string {
  return GEAR_CATEGORY[category] || category;
}

const GEAR_CONDITION: Record<string, string> = {
  new: 'Yeni',
  good: 'İyi',
  fair: 'Orta',
  retired: 'Emekli',
};

export function formatGearCondition(condition: string): string {
  return GEAR_CONDITION[condition] || condition;
}

const GEAR_STATUS: Record<string, string> = {
  available: 'Müsait',
  rented: 'Kirada',
  maintenance: 'Bakımda',
};

export function formatGearStatus(status: string): string {
  return GEAR_STATUS[status] || status;
}

const RATE_STATUS: Record<string, string> = {
  active: 'Aktif',
  upcoming: 'Yakında',
  archived: 'Arşiv',
};

export function formatRateStatus(status: string): string {
  return RATE_STATUS[status] || status;
}

const RATE_CATEGORY: Record<string, string> = {
  day_pass: 'Günlük Giriş',
  monthly_membership: 'Aylık Üyelik',
  punch_card: 'Kart Paketi',
  intro_lesson: 'Giriş Dersi',
  gear_rental: 'Ekipman Kiralama',
  other: 'Diğer',
};

export function formatRateCategory(category: string): string {
  return RATE_CATEGORY[category] || category;
}

const MONTH_NAMES: Record<number, string> = {
  1: 'Ocak',
  2: 'Şubat',
  3: 'Mart',
  4: 'Nisan',
  5: 'Mayıs',
  6: 'Haziran',
  7: 'Temmuz',
  8: 'Ağustos',
  9: 'Eylül',
  10: 'Ekim',
  11: 'Kasım',
  12: 'Aralık',
};

export function formatMonth(month: number): string {
  return MONTH_NAMES[month] || String(month);
}
