import Head from 'next/head';
import Button from '@material-ui/core/Button';
import withLayout from '../lib/withLayout';;

const Index = () => (
    <div style={{padding: '10px 45px'}}>
        <Head>
            <title>Index Page</title>
            <meta name="description" content="This is description of Index page" />
        </Head>
        <p>Content on Index Page</p>
        <Button variant="raised">
            MUI Button
        </Button>
    </div>
);

export default withLayout(Index);