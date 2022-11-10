import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Header, Menu } from "semantic-ui-react";

import Username from '../components/Username';
import MessageDisplay from '../components/MessageDisplay';
import ExpPoints from '../components/ExpPoints';

import styles from './SiteHeader.module.css';

type SiteHeaderProps = {

};

const SiteHeader = (props: SiteHeaderProps) => {
    const { data: session } = useSession();
    const user = session?.user;
    const experience = 90;
    const handleSignin = (e) => {
        e.preventDefault()
        signIn()
    };

    const handleSignout = (e) => {
        e.preventDefault()
        signOut()
    };


    return (
        <>
            <Header as="header">
                <h1>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Musical_notes.svg" height="50"/>
                    {' '}
                    <span>Duo Bongo</span>
                </h1>
            </Header>
            <Menu>
                <Menu.Item>
                    <Link href="/">
                        Home
                    </Link>
                </Menu.Item>
                { user
                  && <Menu.Item>
                      <Link href="/overview">
                          Overview
                      </Link>
                  </Menu.Item>
                }
                { user
                  && <Menu.Item>
                      <Link href="/stats">
                          Stats
                      </Link>
                  </Menu.Item>
                }
                <Menu.Menu position="right">
                    { user
                      && <Menu.Item>
                          <Username name={user.name} />
                          <ExpPoints points={experience} />
                      </Menu.Item>
                    }
                    { session
                      && <Menu.Item>
                          <Link href="/logout" onClick={handleSignout}>Logout</Link>
                      </Menu.Item>
                    }
                    { !session
                      && <Menu.Item>
                          <Link href="/signup">Sign up</Link>
                      </Menu.Item>
                    }
                    { !session
                      && <Menu.Item>
                          <Link href="/login" onClick={handleSignin}>Log in</Link>
                      </Menu.Item>
                    }
                </Menu.Menu>
            </Menu>
        </>
    );
};

export default SiteHeader;
