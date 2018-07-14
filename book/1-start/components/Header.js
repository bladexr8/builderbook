import Link from 'next/link';

import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';

import { styleToolbar } from './SharedStyles';

// Application Header
const Header = () => (
    <div>
        <Toolbar style={styleToolbar}>
            <Grid container direction="row" justify="space-around" align="center">
                <Grid item xs={12} style={{textAlign: 'right'}}>
                    <Link prefetch href="/login">
                        <a style={{margin: '0px 20px 0px auto'}}>Log In</a>
                    </Link>
                </Grid>
            </Grid>
        </Toolbar>
    </div>
);

export default Header;

