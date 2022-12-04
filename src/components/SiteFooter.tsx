import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Divider } from 'semantic-ui-react';

import styles from '../styles/SiteFooter.module.css';


type SiteFooterProps = {

};

const SiteFooter = (props: SiteFooterProps) => {
    return (
        <footer className={styles.footer}>
            <p>
                Duo Bongo
            </p>
            <p>
                Lorem ipsum, baby!
            </p>
            <p>
                <Link href="/terms-of-service">Terms of Service</Link><br/>
                <Link href="/privacy-statement">Privacy Statement</Link>
            </p>

        </footer>
    );
};

export default SiteFooter;
