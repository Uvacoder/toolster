import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';

const Home: NextPage = () => (
  <>
    <Head>
      <title>test</title>
    </Head>
    <div>
      <Link href="/pomodoro">Pomodoro</Link>
    </div>
  </>
);

export default Home;
