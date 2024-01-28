import { Fragment } from "react";
import { ThemeProvider } from "react-bootstrap";

export const KThemeProvider = ({ children }) => {
    let theme = {};

    return (
        <ThemeProvider theme={theme}>
            <Fragment>
                {children}
            </Fragment>
        </ThemeProvider>
    );
}

