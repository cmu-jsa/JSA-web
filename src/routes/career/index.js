/**
 * Career fair page
 *
 * @module src/routes/career
 */

import React from 'react';
import CompanyListItem from './CompanyListItem';
import List from '@mui/material/List';
import ScheduleTable from './careerSchedule.js';
import companies from './companies.csv';

const CareerFair = () => {
    return (
        <div>
            <div>
                <h1>CMU JSA RIPPLE - Career Fair Fall 2021</h1>
                <p>
                    For the second year in a row, CMU JSA is proud to present 
                    CMU JSA Career Fair, a virtual event aimed to match college 
                    students who speak English and Japanese with companies 
                    in Japan solving interesting problems. The event is also
                    focused on specifically providing underclassmen 
                    with job opportunities.</p>
                <p>
                    Date/Time: October 20-21
                </p>
                <h2> Important Links </h2>
                <p>
                    <a href="https://forms.gle/jLEkNPQdYy7xQukU9"> Registration Form </a>
                    <a href="https://www.google.com/url?q=https://cmu.zoom.us/j/9112688894&sa=D&source=calendar&ust=1633874998440310&usg=AOvVa w2xICU1A40Ezsej1o-LjG6R">
                        Zoom Link
                    </a>
                </p>
                <h2> Schedule </h2>
                <ScheduleTable />
                <h2>Participating Companies</h2>
                <List>
                    {companies.map((company, i) => 
                        <CompanyListItem company={company} index={i} key={i}/>
                    )}
                </List>
                <h2>Sponsors</h2>
                <div className="sponsors">
                    <a href="https://mujin-corp.com/">
                        <img src="/images/career/mujin.png" width="800"/>
                    </a>
                    <a href="https://app.menu.jp/">
                        <img src="/images/career/menu.png" width="600"/>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CareerFair;
 