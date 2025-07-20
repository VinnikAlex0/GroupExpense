import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GroupsPage from "./pages/GroupsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/groups" replace />} />
        <Route path="/groups" element={<GroupsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
