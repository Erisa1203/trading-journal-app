import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Backtest from "./pages/Backtest/Backtest";
import Home from "./pages/Home/Home";
import Rules from "./pages/Rules/Rules";
import TradingJournal from "./pages/TradingJournal/TradingJournal";
import "./stylus/App.styl"
import { FilterProvider } from './contexts/FilterContext';
import AppProvider from './Provider/AppProvider';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  
  return (
    <ThemeProvider>
      <AppProvider>
        <FilterProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/trading-journal" element={<TradingJournal />} />
              <Route path="/backtest" element={<Backtest />} />
              <Route path="/rules" element={<Rules />} />
              {/* <Route path="/setting" element={<Setting />} /> */}
            </Routes>
          </Router>
        </FilterProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
