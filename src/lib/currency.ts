

export const SUPPORTED_CURRENCIES = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'INR', name: 'Indian Rupee' },
];

// Mock exchange rates relative to USD
const EXCHANGE_RATES: { [key: string]: number } = {
    'USD': 1,
    'EUR': 1.09, // 1 EUR = 1.09 USD
    'GBP': 1.29, // 1 GBP = 1.29 USD
    'INR': 0.012, // 1 INR = 0.012 USD
};

export const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
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

export const convertToUsd = (amount: number, currencyCode: string = 'USD') => {
    const rate = EXCHANGE_RATES[currencyCode];
    if (rate === undefined) {
        // In a real app, you might want to fetch the rate or handle this as a more critical error.
        console.warn(`Exchange rate for ${currencyCode} not found. Returning original amount.`);
        return amount;
    }
    // This is a simplified conversion. For real financial calculations, you'd use a library that handles floating-point precision.
    return amount * rate;
};
