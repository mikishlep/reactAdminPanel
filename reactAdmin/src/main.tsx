import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ruRU } from "@mui/material/locale";

const themes = {
    glavreklama: {
        dark: false,
        colors: {
            primary: "#e7474c",
        },
    },
};

const defaultTheme = themes.glavreklama;

const theme = createTheme({
    palette: {
        mode: defaultTheme.dark ? "dark" : "light",
        primary: {
            main: defaultTheme.colors.primary,
            contrastText: "#fff",
        },
    },
}, ruRU);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);