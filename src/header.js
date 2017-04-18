import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import classNames from 'classnames';

import Dropdown from '~/components/dropdown';
import styles from './header.less';

const {
    string, arrayOf, oneOfType, func, shape, object, node
} = React.PropTypes;

const routeConfigShape = {
    name: string.isRequired,
    title: string,
    routeConfig: arrayOf(object)
};

function Logo() {
    return <div className={styles.logo}>
        <NavLink to='/' exact activeClassName={styles.active}>
            CMU JSA
        </NavLink>
    </div>;
}

function HeaderLink({ parent, name, children, ...props }) {
    const to = `${parent}/${name}`;

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
    parent: string.isRequired,
    name: string.isRequired,
    children: oneOfType([func, node])
};

function DropdownButton({ parent, name, title, isOpen }) {
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
        isActive: React.PropTypes.bool
    };

    return <HeaderLink
        parent={parent}
        name={name}
        exact={false}
        children={Child}
    />;
}

DropdownButton.propTypes = {
    parent: string.isRequired,
    name: string.isRequired,
    title: string.isRequired,
    isOpen: React.PropTypes.bool
};

function DropdownMenu({ parent, name, title, routeConfig }) {
    return <div className={styles.menu}>
        <HeaderLink parent={parent} name={name}>{title}</HeaderLink>
        {renderRoutes(routeConfig, `${parent}/${name}`)}
    </div>;
}

DropdownMenu.propTypes = {
    parent: string.isRequired,
    name: string.isRequired,
    title: string.isRequired,
    isOpen: React.PropTypes.bool,
    routeConfig: arrayOf(shape(routeConfigShape))
};

function renderRoutes(routeConfig, parent) {
    return routeConfig.filter(config =>
        'title' in config
    ).map(({ routeConfig: subRoutes, title, name }, i) => {
        if (!subRoutes) {
            return <HeaderLink
                key={i}
                parent={parent}
                name={name}
            >
                {title}
            </HeaderLink>;
        }

        const button = <DropdownButton
            parent={parent}
            name={name}
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
                parent={parent}
                name={name}
                title={title}
                routeConfig={subRoutes}
            />
        </Dropdown>;
    });
}

export default function Header({ routeConfig }) {
    return <div className={styles.header}>
        <div className={styles.navigation}>
            <Logo />
            {renderRoutes(routeConfig, '')}
        </div>
    </div>;
}

Header.propTypes = {
    routeConfig: arrayOf(shape({
        name: string.isRequired,
        title: string,
        routeConfig: arrayOf(shape(routeConfigShape))
    }))
};

