import Head from 'next/head';
import { GetStaticProps } from 'next';

import { siteTitle } from '../config';
import Layout from '../components/layout';
import Date from '../components/date';
import { getLecturesDataByTier } from '../lib/lectures';

import utilStyles from '../styles/utils.module.css';
import styles from '../styles/overview.module.css';


export const getStaticProps: GetStaticProps = () => {
    const lecturesByTier = getLecturesDataByTier();
    return {
        props: {
            lecturesByTier
        }
    };
};

type LecturesData = {
    id: string
    tier: number
    topic: string
    number: number
    title: string
    date: string
};

type HomeProps = {
    lecturesByTier: LecturesData[]
};



function Home ({ lecturesByTier }: HomeProps) {
    return (
        <Layout home>
            <Head>
                <title>Home — {siteTitle}</title>
            </Head>
            <h2>
                Duo Bongo <i className="bang">!</i>
            </h2>
            <section>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus ornare suspendisse sed nisi. Orci nulla pellentesque dignissim enim sit amet venenatis urna. Sit amet consectetur adipiscing elit duis. Sed risus ultricies tristique nulla aliquet.</p>

                <h3>Diam quam nulla</h3>
                <p>Volutpat est velit egestas dui id ornare. Odio aenean sed adipiscing diam donec adipiscing tristique risus. Et odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Libero nunc consequat interdum varius sit amet mattis vulputate.</p>

                <p>Sollicitudin nibh sit amet commodo nulla facilisi nullam. Integer malesuada nunc vel risus. Netus et malesuada fames ac turpis. Sit amet commodo nulla facilisi nullam vehicula. Tellus id interdum velit laoreet id donec.</p>

                <p>Quis blandit turpis cursus in hac habitasse platea dictumst. In aliquam sem fringilla ut morbi tincidunt augue interdum velit. A scelerisque purus semper eget.</p>

                <h3>Neque laoreet</h3>
                <p>Viverra vitae congue eu consequat ac felis donec et. Ornare quam viverra orci sagittis eu volutpat.</p>

                <ul>
                    <li>Quis hendrerit dolor magna eget est. </li>
                    <li>Tincidunt augue interdum velit euismod in pellentesque massa placerat.</li>
                    <li>Vitae tortor condimentum lacinia quis.</li>
                    <li>Amet cursus sit amet dictum.</li>
                </ul>

                <p>Turpis tincidunt id aliquet risus feugiat in. Eu ultrices vitae auctor eu augue ut. Lobortis elementum nibh tellus molestie nunc. Ac felis donec et odio pellentesque diam volutpat commodo. </p>
            </section>
        </Layout>
    );
}

export default Home;
