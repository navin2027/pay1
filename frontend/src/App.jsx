import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";

import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import {SendMoney} from "./pages/SendMoney";
import { BalanceCheck } from "./pages/BalanceCheck";
import { UpdatePage } from "./pages/UpdatePage";
import { Transaction } from "./pages/Transaction";
import HomePage from "./pages/HomePage";

console.log("App.jsx file here");

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="/balancecheck" element={<BalanceCheck />} />
          <Route path="/update" element={<UpdatePage />} />
          <Route path="/transaction" element={<Transaction />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
