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
import Button from '@mui/material/Button';
import styles from './index.module.css';

const CareerFair = () => {
    return (
        <div>
            <div>
                <h1>CMU JSA RIPPLE - Career Fair Fall 2021 </h1>
                <img className={styles.help} src="/images/career/flyer.jpeg"/>
                <p>
                    Ripple is a career fair by Carnegie Mellon University’s Japanese Student Association (CMU JSA) with the sole intent of connecting five amazing companies in Japan with outstanding college students in America.
                    Come join in and connect with a mix of established giants and groundbreaking startups that are looking for new college talent!
                </p>
                <p>
                    Each company will hold a 30 minute session about internship programs and new-graduate positions, with a Q&A at the end.
                    The event is also focused on specifically providing underclassmen with job opportunities.
                </p>
                <h3>
                    Participants will have a chance to win a $25 Amazon gift card and get free merch from companies that will be taking part in our career fair!
                </h3>
                <h3>
                    Date/Time: October 20-21
                </h3>
                <h2> Important Links </h2>
                <div className={styles.buttons}>
                    <Button target="_blank" variant="contained" fullWidth={true} href="https://forms.gle/jLEkNPQdYy7xQukU9">
                        Registration
                    </Button>
                    <Button target="_blank" variant="contained" fullWidth={true} href="https://www.google.com/url?q=https://cmu.zoom.us/j/9112688894&sa=D&source=calendar&ust=1633874998440310&usg=AOvVa w2xICU1A40Ezsej1o-LjG6R">
                        Zoom Room
                    </Button>
                </div>
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
                    <a href="https://reazon.jp/">
                        <img src="/images/career/reazonholdings.jpeg" width="600"/>
                    </a>
                </div>
                <h2>
                    About Ripple
                </h2>
                <p>
                    <p>
                    Just like how a single droplet can start a ripple, we hope this fair becomes that first drop which allows you to build deep connections with innovative companies in Japan.
                    </p>
                </p>
            </div>
        </div>
    );
};

export default CareerFair;
 