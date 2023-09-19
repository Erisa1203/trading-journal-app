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

export const getPairColor = (tag) => {
    const mainCurrency = tag.substring(0, 3); // 通貨ペアから最初の3文字を取得

    switch(mainCurrency) {
        case 'EUR':
            return backgrounds.blue;
        case 'USD':
            return backgrounds.red;
        case 'GBP':
            return backgrounds.green;
        case 'AUD':
            return backgrounds.orange;
        case 'CAD':
            return backgrounds.yellow;
        case 'NZD':
            return backgrounds.purple;
        default:
            return backgrounds.gray; // 
    }
}
