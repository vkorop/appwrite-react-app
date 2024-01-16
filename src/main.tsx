import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import QueryProvider from "./lib/react-query/QueryProvider";
import { ToastProvider } from "./components/ui/toast";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <QueryProvider>
            <AuthProvider>
                <ToastProvider>
                    <App/>
                </ToastProvider>
            </AuthProvider>
        </QueryProvider>
    </BrowserRouter>
);
