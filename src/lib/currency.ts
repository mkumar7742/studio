
export const SUPPORTED_CURRENCIES = [
    { code: 'EUR', name: 'Euro' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'GBP', name: 'British Pound' },
];

// Mock exchange rates relative to EUR
const EXCHANGE_RATES: { [key: string]: number } = {
    'EUR': 1,
    'USD': 0.92, // 1 USD = 0.92 EUR
    'GBP': 1.18, // 1 GBP = 1.18 EUR
};

export const formatCurrency = (amount: number, currencyCode: string = 'EUR') => {
    try {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
        });
        return formatter.format(amount);
    } catch (e) {
        // Fallback for unsupported currency codes
        return `${amount.toFixed(2)} ${currencyCode}`;
    }
};

export const convertToEur = (amount: number, currencyCode: string = 'EUR') => {
    const rate = EXCHANGE_RATES[currencyCode];
    if (rate === undefined) {
        // In a real app, you might want to fetch the rate or handle this as a more critical error.
        console.warn(`Exchange rate for ${currencyCode} not found. Returning original amount.`);
        return amount;
    }
    // This is a simplified conversion. For real financial calculations, you'd use a library that handles floating-point precision.
    return amount * rate;
};
