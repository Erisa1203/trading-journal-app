export const sortOptionsAlphabetically = (options) => {
    return options.sort((a, b) => a.value.localeCompare(b.value));
};

