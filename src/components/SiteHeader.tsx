import { useEffect, useState } from 'react';
import { Header, Menu } from "semantic-ui-react";

import NavMenu from '../components/NavMenu';
import { SITE_TITLE } from '../config';

import styles from '../styles/SiteHeader.module.css';

type SiteHeaderProps = {

};

const SiteHeader = (props: SiteHeaderProps) => {
    return (
        <>
            <Header as="header">
                <div className="site-title">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Musical_notes.svg" height="50"/>
                    {' '}
                    <span>{ SITE_TITLE }</span>
                </div>
            </Header>
            <NavMenu/>
        </>
    );
};

export default SiteHeader;
