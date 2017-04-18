import React from 'react';

export default function NotFound({ location: { pathname } }) {
    return <div>
        <h1>404 - Not Found</h1>
        <p>The location <code>{pathname}</code> does not exist.</p>
    </div>;
}

NotFound.propTypes = {
    location: React.PropTypes.shape({
        pathname: React.PropTypes.string.isRequired
    }).isRequired
};

