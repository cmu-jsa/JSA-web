import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import classNames from 'classnames';

import Dropdown from '~/components/dropdown';
import styles from './header.less';

const {
bool, string, oneOfType, func, shape, object, node
} = React.PropTypes;

function objectIsEmpty(obj) {
    // eslint-disable-next-line guard-for-in
    for (const key in obj) {
        return false;
    }

    return true;
}

function Logo() {
    return <div className={styles.logo}>
        <NavLink to='/' exact activeClassName={styles.active}>
            CMU JSA
        </NavLink>
    </div>;
}

function HeaderLink({ to, children, ...props }) {
    return typeof children === 'function'
        ? <Route path={to} children={children} {...props} />
        : <NavLink
            to={to}
            exact
            activeClassName={styles.active}
            {...props}
        >
            {children}
        </NavLink>;
}

HeaderLink.propTypes = {
    to: string.isRequired,
    children: oneOfType([func, node])
};

function DropdownButton({ to, title, isOpen }) {
    function Child({ isActive }) {
        const classes = classNames(styles.button, {
            [styles.active]: isActive,
            [styles.open]: isOpen
        });

        const onClick = event => event.preventDefault();

        return <a className={classes} href='' onClick={onClick}>
            {title}
        </a>;
    }

    Child.propTypes = {
        isActive: bool
    };

    return <HeaderLink
        to={to}
        exact={false}
        children={Child}
    />;
}

DropdownButton.propTypes = {
    to: string.isRequired,
    title: string.isRequired,
    isOpen: bool
};

function DropdownMenu({ to, title, children }) {
    return <div className={styles.menu}>
        <HeaderLink to={to}>{title}</HeaderLink>
        {renderRoutes(to, children)}
    </div>;
}

DropdownMenu.propTypes = {
    to: string.isRequired,
    title: string.isRequired,
    isOpen: bool,
    children: object.isRequired
};

function renderRoutes(parent, children) {
    return Object.keys(children)
        .map((name, i) => {
            const { children: grandchildren, title, path } = children[name];

            if (objectIsEmpty(grandchildren)) {
                return <HeaderLink
                    key={i}
                    to={path}
                >
                    {title}
                </HeaderLink>;
            }

            const button = <DropdownButton
                to={path}
                title={title}
            />;

            const { enter, enterActive, leave, leaveActive } = styles;

            return <Dropdown
                key={i}
                className={styles.dropdown}
                button={button}
                transitionName={{
                    enter, enterActive, leave, leaveActive
                }}
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
            >
                <DropdownMenu
                    to={path}
                    title={title}
                    children={grandchildren}
                />
            </Dropdown>;
        });
}

export default function Header({ routeConfig }) {
    return <div className={styles.header}>
        <div className={styles.navigation}>
            <Logo />
            {renderRoutes('', routeConfig.children)}
        </div>
    </div>;
}

Header.propTypes = {
    routeConfig: shape({
        path: string.isRequired,
        title: string.isRequired,
        children: object.isRequired
    })
};

