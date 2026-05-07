import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Dashboard } from "./Dashboard";
import { CodeEditor } from "./CodeEditor";
import { Layout } from "./Layout";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route element={<Layout />}>
            <Route path="/room/:id" element={<CodeEditor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
