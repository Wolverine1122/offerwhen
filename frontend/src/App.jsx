import { Routes, Route, Navigate } from "react-router-dom";
import About from "./pages/About/About";
import Companies from "./pages/Companies/Companies";
import Company from "./pages/Company/Company";
import NotFound from "./pages/NotFound/NotFound";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import DiscordBot from "./pages/DiscordBot/DiscordBot";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/companies" />} />
        <Route path="/about" element={<About />} />
        <Route path="/companies">
          <Route index element={<Companies />} />
          <Route path=":id" element={<Company />} />
        </Route>
        <Route path="/discord-bot" element={<DiscordBot />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
