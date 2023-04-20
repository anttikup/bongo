import { useState } from 'react';
import Link from 'next/link';
import { Menu, Dropdown, DropdownMenu } from 'semantic-ui-react';
//import LogoutModal from './LogoutModal';
import { useMediaQuery } from 'react-responsive';
import { signIn, signOut } from 'next-auth/react';

import { useStateValue } from '../state';
import Username from '../components/Username';
import ExpPoints from '../components/ExpPoints';

import type { MouseEvent } from 'react';


type NavMenuProps = {

};

function NavMenu(props: NavMenuProps) {
    const [activeItem, setActiveItem] = useState('Laptop Item')
    const [showModal, setShowModal] = useState(false)
    const isMobile = useMediaQuery({ query: '(max-width: 991px)' });
    const [{ experience, user }, dispatch] = useStateValue();

    const handleSignin = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        signIn(undefined, {
            callbackUrl: '/overview',
        });
    };

    const handleSignout = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        signOut({ redirect: true, callbackUrl: '/' });
    };


    return (
        <Menu as="nav">

            { !isMobile &&
              <Menu.Menu key="desktop">
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
              </Menu.Menu>
            }
            { isMobile &&
              <Dropdown
                  item
                  icon ='bars'
                  key='mobile'
              >
                  <Dropdown.Menu>
                      <Dropdown.Item>
                          <Link href="/">
                              Home
                          </Link>
                      </Dropdown.Item>
                      { user
                        && <Dropdown.Item>
                            <Link href="/overview">
                                Overview
                            </Link>
                        </Dropdown.Item>
                      }
                      { user
                        && <Dropdown.Item>
                            <Link href="/lectures">
                                Lectures
                            </Link>
                        </Dropdown.Item>
                      }
                      { user
                        && <Dropdown.Item>
                            <Link href="/stats">
                                Stats
                            </Link>
                        </Dropdown.Item>
                      }
                      { user
                        && <Dropdown.Item>
                            <Link href="/settings">
                                Settings
                            </Link>
                        </Dropdown.Item>
                      }
                  </Dropdown.Menu>
              </Dropdown>
            }
            <Menu.Menu position="right">
                { user
                  && <Menu.Item>
                      <Username name={user.username} />
                      <ExpPoints points={experience} />
                  </Menu.Item>
                }
                { user
                  && <Menu.Item>
                      <Link href="/logout" onClick={handleSignout}>Logout</Link>
                  </Menu.Item>
                }
                { !user
                  && <Menu.Item>
                      <Link href="/signup">Sign up</Link>
                  </Menu.Item>
                }
                { !user
                  && <Menu.Item>
                      <Link href="/login" onClick={handleSignin}>Log in</Link>
                  </Menu.Item>
                }
            </Menu.Menu>
        </Menu>
    );
}

export default NavMenu;
