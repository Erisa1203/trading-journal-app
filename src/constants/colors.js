export const colors = {
    default: "#343330",
    gray: "#7C7C7C",
    orange: "#E0A166",
    yellow: "#E0D466",
    green: "#66E081",
    blue: "#6681E0",
    purple: "#8D66E0",
    pink: "#CF66E0",
    red: "#E06666"
};

export const backgrounds = {
    lightGray: "#F1F1F1",
    gray: "#EFEFEF",
    orange: "#FBF4ED",
    yellow: "#FBFAED",
    green: "#EDFBF0",
    blue: "#EDF0FB",
    purple: "#F1EDFB",
    pink: "#F9EDFB",
    red: "#FBEDED"
};

function adjustBrightness(hex, percent) {
    const num = parseInt(hex.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return '#' + (
        0x1000000 + 
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + 
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + 
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1).toUpperCase();
}

function getRandomPercent() {
    const variation = Math.floor(Math.random() * 41); // 0-40の間のランダムな数字を取得
    return variation - 20; // -20から20の間の数を返す
}

export const pairColors = {
    // EUR に関連する通貨ペア
    'EUR/USD': adjustBrightness(colors.blue, getRandomPercent()),
    'EUR/JPY': adjustBrightness(colors.blue, getRandomPercent()),
    'EUR/GBP': adjustBrightness(colors.blue, getRandomPercent()),
    'EUR/AUD': adjustBrightness(colors.blue, getRandomPercent()),
    'EUR/CAD': adjustBrightness(colors.blue, getRandomPercent()),
    'EUR/NZD': adjustBrightness(colors.blue, getRandomPercent()),

    // USD に関連する通貨ペア
    'USD/JPY': adjustBrightness(colors.red, getRandomPercent()),
    'GBP/USD': adjustBrightness(colors.red, getRandomPercent()),
    'AUD/USD': adjustBrightness(colors.red, getRandomPercent()),
    'USD/CAD': adjustBrightness(colors.red, getRandomPercent()),
    'USD/CHF': adjustBrightness(colors.red, getRandomPercent()),
    'NZD/USD': adjustBrightness(colors.red, getRandomPercent()),
    'USD/ZAR': adjustBrightness(colors.red, getRandomPercent()),
    'USD/TRY': adjustBrightness(colors.red, getRandomPercent()),
    'USD/SGD': adjustBrightness(colors.red, getRandomPercent()),
    'USD/RUB': adjustBrightness(colors.red, getRandomPercent()),
    'USD/MXN': adjustBrightness(colors.red, getRandomPercent()),
    'USD/HKD': adjustBrightness(colors.red, getRandomPercent()),
    'USD/SEK': adjustBrightness(colors.red, getRandomPercent()),
    'USD/DKK': adjustBrightness(colors.red, getRandomPercent()),
    'USD/CNH': adjustBrightness(colors.red, getRandomPercent()),
    'USD/BRL': adjustBrightness(colors.red, getRandomPercent()),
    'USD/NOK': adjustBrightness(colors.red, getRandomPercent()),
    'USD/INR': adjustBrightness(colors.red, getRandomPercent()),

    // GBP に関連する通貨ペア
    'GBP/JPY': adjustBrightness(colors.green, getRandomPercent()),
    'GBP/AUD': adjustBrightness(colors.green, getRandomPercent()),
    'GBP/CAD': adjustBrightness(colors.green, getRandomPercent()),
    'GBP/CHF': adjustBrightness(colors.green, getRandomPercent()),
    'GBP/NZD': adjustBrightness(colors.green, getRandomPercent()),

    // AUD に関連する通貨ペア
    'AUD/JPY': adjustBrightness(colors.orange, getRandomPercent()),
    'AUD/CAD': adjustBrightness(colors.orange, getRandomPercent()),
    'AUD/NZD': adjustBrightness(colors.orange, getRandomPercent()),

    // その他の通貨ペア
    'CAD/JPY': adjustBrightness(colors.yellow, getRandomPercent()),
    'CHF/JPY': adjustBrightness(colors.pink, getRandomPercent()),
    'NZD/JPY': adjustBrightness(colors.purple, getRandomPercent()),

    // 必要に応じて他の通貨ペアと色のマッピングを追加...
};
