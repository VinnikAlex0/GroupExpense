import { BrowserRouter, Routes, Route } from "react-router-dom";
import GroupsPage from "./pages/GroupsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/groups" element={<GroupsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
