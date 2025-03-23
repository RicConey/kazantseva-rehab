// app/layout.js
import "../styles/globals.css";
import AnalyticsProvider from "./analytics-provider";
import Header from "./Header";

export const metadata = {
    title: "Kazantseva Rehabilitation",
    description: "Реабілітація. Наталія Казанцева.",
};

export const viewport = {
    width: "device-width",
    initialScale: 1.0,
};

export default function RootLayout({ children }) {
    return (
        <html lang="uk">
        <body>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
            <Header />
            <main style={{ padding: "20px" }}>{children}</main>
        </div>
        <footer style={{ textAlign: "center", padding: "10px 0" }}>
            &copy; {new Date().getFullYear()} Kazantseva Rehabilitation. Всі права захищені.
        </footer>
        <AnalyticsProvider />
        </body>
        </html>
    );
}
