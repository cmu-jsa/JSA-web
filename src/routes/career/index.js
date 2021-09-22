/**
 * Career fair page
 *
 * @module src/routes/career
 */

import React from 'react';
import CompanyListItem from './CompanyListItem';
import List from '@mui/material/List';

import companies from './companies.csv';

const CareerFair = () => {
    return (
        <div>
            <div>
                <h1>CMU JSA Career Fair</h1>
                <p>
                    For the second year in a row, CMU JSA is proud to present 
                    CMU JSA Career Fair, a virtual event aimed to match college 
                    students who speak English and Japanese with companies 
                    in Japan solving interesting problems. The event is also
                    focused on specifically providing underclassmen 
                    with job opportunities.</p>
                <p>
                    Date/Time: TBD
                </p>
                <p>
                    Location: Zoom
                </p>
                <h2>Participating Companies</h2>
                <List>
                    {companies.map((company, i) => 
                        <CompanyListItem company={company} index={i} key={i}/>
                    )}
                </List>
                <h2>Sponsors</h2>
                <p>
                    Coming soon...
                </p>
            </div>
        </div>
    );
};

export default CareerFair;
 