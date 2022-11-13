import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Divider, Icon } from 'semantic-ui-react';

type LockDividerProps = {
    open: boolean;
};

const LockDivider = ({ open }: LockDividerProps) => {
    return (
        <Divider horizontal>
            <Icon name={open ? 'lock open' : 'lock'} color="darkred" />
        </Divider>
    );
};

export default LockDivider;
