import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
export const getCurrentMonthYear = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export const formatBudgetPeriod = (period: string) => {
    return period.charAt(0).toUpperCase() + period.slice(1);
};


export const getCurrentMonth = () => {
    const now = new Date();
    return {
        start: startOfMonth(now),
        end: endOfMonth(now),
        formatted: format(now, "yyyy-MM")
    };
};

export const getPreviousMonth = (months: number = 1) => {
    const prevMonth = subMonths(new Date(), months);
    return {
        start: startOfMonth(prevMonth),
        end: endOfMonth(prevMonth)
    };
};

export const getPreviousSixMonths = () => {
    const prev6Month = subMonths(new Date(), 6);
    const thisMonth = new Date();
    return {
        start: startOfMonth(prev6Month),
        end: endOfMonth(thisMonth)
    };
};