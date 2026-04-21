import { format, parseISO } from "date-fns";

/**
 * Format a number as currency (EUR by default).
 * Example: formatCurrency(1234.5) → "€1,234.50"
 */
export function formatCurrency(
    amount: number,
    currency = "EUR",
    locale = "de-DE"
): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Format an ISO date string as a human-readable date.
 * Example: formatDate("2026-01-15") → "January 15, 2026"
 */
export function formatDate(dateString: string): string {
    return format(parseISO(dateString), "MMMM d, yyyy");
}

/**
 * Format an ISO date string as a short date.
 * Example: formatDateShort("2026-01-15") → "Jan 15, 2026"
 */
export function formatDateShort(dateString: string): string {
    return format(parseISO(dateString), "MMM d, yyyy");
}

/**
 * Format an ISO date string as a relative-style short date.
 * Example: formatDateCompact("2026-01-15") → "15/01/2026"
 */
export function formatDateCompact(dateString: string): string {
    return format(parseISO(dateString), "dd/MM/yyyy");
}
