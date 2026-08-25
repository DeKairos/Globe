export function formatTime(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return 'Time unavailable';
  }
}

export function formatTime24(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    return 'Time unavailable';
  }
}

export function calculateTimeDifference(
  fromTimezone: string,
  toTimezone: string
): string {
  try {
    const now = new Date();
    const fromTime = new Date(
      now.toLocaleString('en-US', { timeZone: fromTimezone })
    );
    const toTime = new Date(
      now.toLocaleString('en-US', { timeZone: toTimezone })
    );

    const diffMs = toTime.getTime() - fromTime.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    if (diffHours === 0) return 'Same time';

    const absHours = Math.abs(diffHours);
    const direction = diffHours > 0 ? 'ahead' : 'behind';
    return `${absHours}h ${direction}`;
  } catch {
    return 'Unknown';
  }
}

export function convertTime(
  timeStr: string,
  fromTimezone: string,
  toTimezone: string
): { time: string; dayDiff: number } {
  try {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);

    const sourceDate = new Date(
      now.toLocaleString('en-US', { timeZone: fromTimezone })
    );
    const targetDate = new Date(
      now.toLocaleString('en-US', { timeZone: toTimezone })
    );
    const offsetDiff = targetDate.getTime() - sourceDate.getTime();

    const inputDate = new Date(now);
    inputDate.setHours(hours, minutes, 0, 0);

    const convertedDate = new Date(inputDate.getTime() + offsetDiff);

    const timeStr24 = convertedDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const dayDiff = Math.round(
      (convertedDate.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return { time: timeStr24, dayDiff };
  } catch {
    return { time: '--:--', dayDiff: 0 };
  }
}

export function getTimezoneOffset(timezone: string): number {
  try {
    const now = new Date();
    const tzDate = new Date(
      now.toLocaleString('en-US', { timeZone: timezone })
    );
    return (tzDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  } catch {
    return 0;
  }
}