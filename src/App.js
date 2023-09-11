import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Backtest from "./pages/Backtest/Backtest";
import Home from "./pages/Home/Home";
import Rules from "./pages/Rules/Rules";
import TradingJournal from "./pages/TradingJournal/TradingJournal";
import Setting from './pages/Setting/Setting';
import { Check } from 'phosphor-react';
import "./stylus/App.styl"
import { FilterProvider } from './contexts/FilterContext';
import AppProvider from './Provider/AppProvider';

function App() {

  return (
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
  );
}

export default App;
