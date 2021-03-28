/**
 * Matsuri Schedule page
 *
 * @module src/routes/matsuri/schedule
 */


import React from 'react';
import './index.less';

class ScheduleTable extends React.PureComponent {
    constructor() {
        super();

        let csvData = require('./matsuriSchedule.csv');
        let headerDates = new Set();
        csvData.forEach(event => { headerDates.add(event['Start Date'])});
        const currYear = 2021;
        headerDates = Array.from(headerDates)
        headerDates.sort((s1, s2) => {
            const date1 = new Date(s1);
            const date2 = new Date(s2);
            date1.setFullYear(currYear);
            date2.setFullYear(currYear);
            return (date1 < date2 ? -1 : 1);
        });

        this.state = {
            scheduleData: csvData,
            headerDates: headerDates,
        };
    }

    getLabel(type) {
        let color;
        switch (type) {
            case 'Food':
                color = 'pink';
                break;
            case 'Performance':
                color = 'blue';
                break;
            case 'Game':
                color = 'green';
                break;
        }
        return (
            <span style={{backgroundColor: color, borderRadius: '12px', color: 'white', padding: '5px', marginLeft: '24px'}}>
                {type}
            </span>
        );
    }

    // red: #ed1c24

    render() {
        return (
            <div className='schedule'>
                {this.state.headerDates.map(headerDate => (
                    <div className='matsuri-day' style={{position: 'relative'}}>
                        <div style={{position: 'sticky', top: '43px', borderRadius: '6px', color: 'white', backgroundColor: '#2e3192', padding: '10px'}}>
                            {headerDate}
                        </div>
                        <table style={{width: '100%'}}>
                            {this.state.scheduleData.filter(event => event['Start Date'] === headerDate).map(event => (
                                <tr className='row' style={{width: '100%', margin: '10px'}}>
                                    <div className='flex-row' style={{display: 'flex', justifyContent: 'space-between', padding: '10px'}}>
                                        <div className='event-time' style={{width: '20%'}}>
                                            {event['Time']}
                                        </div>
                                        <div className='event-detials' style={{width: '80%'}}>
                                            {event.Event}
                                            {this.getLabel(event['Category'])}
                                        </div>
                                    </div>
                                </tr>
                            ))}
                        </table>
                    </div>
                ))}
            </div>
        );
    }
}


/**
 * The schedule component.
 *
 * @returns {ReactElement} The rendered schedule.
 */

export default class MatsuriScheduleTab extends React.Component {
    render() {
        return (
            <div>
                <h1>Schedule</h1>

                <h2>Date, Time, and Location</h2>

                <p>
                    Matsuri 2021's events will be held virtually from Friday,
                    April 9 to Sunday, April 11. We will be hosting multiple
                    games and performances across all three days. 
                </p>
                
                <p>
                    Spread the word and stay informed by joining and sharing the <b>
                        <a href='https://www.facebook.com/events/268303537457369/' target='_blank'>
                        Facebook event
                    </a></b>! 
                </p>

                <p>
                    Our performances will be live-streamed on our <b>
                      <a href='https://www.youtube.com/channel/UCJRtPt616S7M3qonS8Jg83Q' target='_blank'>
                        YouTube Channel
                      </a></b>. Please check back later for a link to the live-stream.
                </p>

                <ScheduleTable />

                {/* <iframe src='https://docs.google.com/spreadsheets/d/e/2PACX-1vRNfFKUKdX-SXMS1EY4_kELX5Erp8LJS2zhTr9PnElw7gjImhQC624mhgqcfWe9aRAkwNSvSXO-PgDw/pubhtml?gid=855555506&amp;single=true&amp;widget=true&amp;headers=false' width='114%' height='920' frameBorder='0' style={{border:0}} allowFullScreen /> */}
                <br />
            </div>
        );
    }
}