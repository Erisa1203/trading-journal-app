import { Timestamp } from 'firebase/firestore';

export const FILTER_OPTIONS = {
  WIN: 'WIN',
  LOSS: 'LOSS',
  OVER_3: 'OVER_3',
  ALL: 'ALL',
  PAIRS: 'PAIRS',
  DIR: 'DIR',
  SETUPS: 'SETUPS',
  PATTERN: 'PATTERN',
  FROM: 'FROM',
  TO: 'TO'
};

export const INITIAL_FILTER_STATE = {
  WIN: '',
  LOSS: '',
  OVER_3: '',
  ALL: '',
  PAIRS: '',
  DIR: '',
  SETUPS: '',
  PATTERN: '',
  FROM: '',
  TO: ''
};

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

export const formatDateToYYYYMMDD = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');  // 月は0から始まるので+1しています
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd}`;
}
