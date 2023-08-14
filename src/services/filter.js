import { Timestamp } from 'firebase/firestore';

export const sortByEntryDateDesc = (trades) => {
  return [...trades].sort((a, b) => {
    if (a.ENTRY_DATE instanceof Timestamp && b.ENTRY_DATE instanceof Timestamp) {
      return b.ENTRY_DATE.seconds - a.ENTRY_DATE.seconds;
    }
    const dateA = new Date(a.ENTRY_DATE);
    const dateB = new Date(b.ENTRY_DATE);
    return dateB - dateA;
  });
};


export const sortByEntryDateAsc = (trades) => {
  return [...trades].sort((a, b) => {
    if (a.ENTRY_DATE instanceof Timestamp && b.ENTRY_DATE instanceof Timestamp) {
      return a.ENTRY_DATE.seconds - b.ENTRY_DATE.seconds;
    }
    const dateA = new Date(a.ENTRY_DATE);
    const dateB = new Date(b.ENTRY_DATE);
    return dateA - dateB;
  });
};

export const resetTime = (date) => {
  date.setHours(0, 0, 0, 0);
  return date;
};
