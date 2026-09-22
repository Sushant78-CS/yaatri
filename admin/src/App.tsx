import AdminPage from "./pages/admin";
import AdminDataProvider from "./context/AdminDataProvider";

function App() {
  return (
    <AdminDataProvider>
      <AdminPage />
    </AdminDataProvider>
  );
}

export default App;
