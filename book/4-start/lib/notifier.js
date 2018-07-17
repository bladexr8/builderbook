// use exported openSnackbar() function from components/Notifier.js to define
// a general purpose notifier function

import { openSnackbar } from '../components/Notifier';

export default function notify(obj) {
    openSnackbar({
        message: obj.message || obj.toString()
    });
}