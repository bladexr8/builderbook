// support for Material-UI server side rendering
import { SheetsRegistry } from 'react-jss';
import { createMuiTheme, createGenerateClassName } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';

const theme = createMuiTheme({
    palette: {
        primary: { main: blue[700] },
        secondary: { main: grey[700] ,}
    },
});

function createPageContext() {
    return {
        theme,
        sheetsManager: new Map(),
        sheetsRegistry: new SheetsRegistry(),
        generateClassName: createGenerateClassName(),
    };
}

export default function getContext() {
    if (!process.browser) {
        return createPageContext();
    }

    if (!global.INIT_MATERIAL_UI) {
        global.INIT_MATERIAL_UI = createPageContext();
        console.log(global.INIT_MATERIAL_UI);
    }

    return global.INIT_MATERIAL_UI;
}