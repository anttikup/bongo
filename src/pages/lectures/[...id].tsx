import Layout from '../../components/layout';
import { getAllLectureParams, getLectureData } from '../../lib/lectures';
import Head from 'next/head';
import Date from '../../components/date';
import { GetStaticPaths, GetStaticProps } from 'next';

import { SITE_TITLE } from '../../config';

import utilStyles from '../../styles/utils.module.css';
import styles from '../../styles/lecture.module.css';


export const getStaticProps: GetStaticProps = async ({ params }) => {
    const lectureData = await getLectureData(params.id.join('/'));
    return {
        props: {
            lectureData
        },
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    const paths = getAllLectureParams();
    return {
        paths,
        fallback: false,
    };
};



export default function Lecture({ lectureData }: {
    lectureData: {
        title: string
        date: string
        contentHtml: string
    }
}) {
    return (
        <Layout>
            <Head>
                <title>{`${lectureData.title} | ${SITE_TITLE}`}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>
                    <div className={utilStyles.superHeading}>
                        <span className={styles.topic}>{lectureData.topic}</span>{' '}
                        <span className={styles.number}>{lectureData.number}</span>
                    </div>
                    {lectureData.title}
                </h1>
                <div className={utilStyles.updatedDate}>
                    Updated <Date dateString={lectureData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: lectureData.contentHtml }} />
            </article>
        </Layout>
    );
};
