import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

let openSnackbarFn;

class Notifier extends React.Component {
    state = {
        open: false,
        message: '',
    };

    // support for opening/closing snackbar from anywhere within application

    // open snackbar by setting the open prop of the snackbar to true
    // pass message prop into snackbar component
    openSnackbar = ({ message }) => {
        this.setState({
            open: true,
            message
        });
    };

    componentDidMount() {
        openSnackbarFn = this.openSnackbar;
    }

    /****************************************************************************/

    handleSnackbarClose = () => {
        this.setState({
            open: false,
            message: '',
        });
    };

    render() {
        const message = (
            <span id="snackbar-message-id" 
                dangerouslySetInnerHTML={{ __html: this.state.message }} />
        );
        return (
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                message={message}
                autoHideDuration={3000}
                onClose={this.handleSnackbarClose}
                open={this.state.open}
                snackbarcontentprops={{
                    'aria-describedby': 'snackbar-message-id',
                }}
            />
        );
    }
}

// in order to access openSnackbar() from anywhere in the app, we need to
// set it's value to another function (openSnackbarFn) that is available
// outside of the Notifier component
export function openSnackbar({ message }) {
    openSnackbarFn({ message });
}

export default Notifier;