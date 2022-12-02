import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Header, Menu } from "semantic-ui-react";

import Username from '../components/Username';
import MessageDisplay from '../components/MessageDisplay';
import ExpPoints from '../components/ExpPoints';
import { useErrorMessage } from '../hooks/errorMessage';
import { getErrorMessage } from '../lib/error';
import userService from '../services/user';
import { setUser, useStateValue } from '../state';


import styles from './SiteHeader.module.css';

import type { MouseEvent } from 'react';


type SiteHeaderProps = {

};

const SiteHeader = (props: SiteHeaderProps) => {
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const [{ experience, user }, dispatch] = useStateValue();
    const [setError] = useErrorMessage();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userFromApi = await userService.getUser();
                dispatch(setUser(userFromApi));
            } catch (e) {
                console.error(e);
                setError('Error fetching user progress', getErrorMessage(e));
            } finally {
                setLoading(false);
            }
        };

        if ( session ) {
            void fetchUser();
        }
    }, [session]);


    const handleSignin = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        signIn();
    };

    const handleSignout = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        signOut({ redirect: true, callbackUrl: '/' });
    };


    return (
        <>
            <Header as="header">
                <div class="site-title">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Musical_notes.svg" height="50"/>
                    {' '}
                    <span>Duo Bongo</span>
                </div>
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
                      <Link href="/lectures">
                          Lectures
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
                { user
                  && <Menu.Item>
                      <Link href="/settings">
                          Settings
                      </Link>
                  </Menu.Item>
                }
                <Menu.Menu position="right">
                    { user
                      && <Menu.Item>
                          <Username name={user.username} />
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
