/**
 * Matsuri Schedule page
 *
 * @module src/routes/matsuri/schedule
 */


import React from 'react';
import './index.less';

/**
 * Schedule Table Component
 *  
 * @returns {ReactElement} The component's elements.
 */
class ScheduleTable extends React.PureComponent {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        let csvData = require('./matsuriSchedule.csv');
        let headerDates = new Set();
        csvData.forEach(event => { headerDates.add(event['Start Date']);});
        const currYear = 2021;
        headerDates = Array.from(headerDates);
        headerDates.sort((s1, s2) => {
            const date1 = new Date(s1);
            const date2 = new Date(s2);
            date1.setFullYear(currYear);
            date2.setFullYear(currYear);
            return (date1 < date2 ? -1 : 1);
        });

        this.state = {
            scheduleData: csvData,
            headerDates: headerDates
        };
    }
    /**
     * Get label for type of event
     * 
     * @param {string} type Type of event
     * @returns {JSX.Element} Event label
     */
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
            default:
                break;
        }
        return (
            <span style={{
                backgroundColor: color,
                borderRadius: '12px',
                color: 'white',
                padding: '5px',
                marginLeft: '24px' }}>
                {type}
            </span>
        );
    }

    /**
     * Get event link
     * 
     * @param {Object} event Event object
     * @returns {JSX.Element} Event label
     */
    getEventLink(event) {
        const cultureTag = event['Culture Tag'];
        let link;
        switch (cultureTag) {
            case 'Food':
                link = '/matsuriculture/food/';
                break;
            case 'Art':
                link = '/matsuriculture/art/';
                break;
            case 'Music':
                link = '/matsuriculture/music/';
                break;
            case 'Games':
                link = '/matsuriculture/games/';
                break;
            case 'Literature':
                link = '/matsuriculture/literature/';
                break;
            case 'Culture':
                link = '/matsuriculture/';
                break;
            default:
                link = false;
        }
        return link;
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        return (
            <div className='schedule'>
                {this.state.headerDates.map(headerDate => (
                    <div className='matsuri-day' style={{ position: 'relative' }} key={headerDate.key}>
                        <div style={{ position: 'sticky', top: '43px', borderRadius: '6px', color: 'white', backgroundColor: '#2e3192', padding: '10px' }}>
                            {headerDate}
                        </div>
                        <table style={{ width: '100%' }}>
                            {this.state.scheduleData.filter(event => event['Start Date'] === headerDate).map(event => (
                                <tr className='row' style={{ width: '100%', margin: '10px' }} key={event.key}>
                                    <div className='flex-row' style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                                        <div className='event-time' style={{ width: '20%' }}>
                                            {event['Time']}
                                        </div>
                                        <div className='event-detials' style={{ width: '80%', display: 'flex', justifyContent: 'space-between' }}>
                                            {this.getEventLink(event)
                                                ? <a href={this.getEventLink(event)}>{event.Event}</a>
                                                : event.Event
                                            }
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
    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     *  <p>
                    Spread the word and stay informed by joining and sharing the <b>
                        <a href='https://www.facebook.com/events/268303537457369/' target='_blank' rel="noopener noreferrer">
                        Facebook event
                        </a>
                    </b>! 
                </p>

        Food,"Friday, April 9",,On-Campus Food Resale,14:00-18:00,Food,1,,,,,,
Food,"Monday, April 5 - Monday, April 12","Monday, April 12",Restaurant Incentive Program,All Day,Food,0,,,,,,
Game,"Friday, April 9",,Virtual Escape Room,19:00-20:00,Games,1,,,,,,
Game,"Sunday, April 11",,Virtual Escape Room,16:00-17:00,Games,2,,,,,,
Performance,"Saturday, April 10",,Opening Remarks,14:00-14:05,,1,,,,,,
Performance,"Saturday, April 10",,Shakuhachi - Itou Keizan,14:05-14:20,Music,1,,,,,,
Performance,"Saturday, April 10",,Haiku Readings,14:20-14:25,Literature,1,,,,,,
Performance,"Saturday, April 10",,Yokai Shokai,14:25-14:30,Culture,1,,,,,,
Performance,"Saturday, April 10",,Taiko - Pittsburgh Taiko,14:30-15:00,Music,1,,,,,,
Performance,"Saturday, April 10",,Karuta,15:00-15:05,Games,1,,,,,,
Performance,"Saturday, April 10",,Cooking Demo - Sukiyaki,15:05-15:10,Food,1,,,,,,
Performance,"Saturday, April 10",,Video Game Trivia,15:10-15:30,Games,1,,,,,,
Performance,"Saturday, April 10",,A Visual History of Shinkansen,15:30-15:40,Culture,1,,,,,,
Performance,"Saturday, April 10",,Dry Flower Cover,15:40-15:45,Music,1,,,,,,
Performance,"Saturday, April 10",,Day 1 Ending Remarks,15:45-15:50,,1,,,,,,
Performance,"Sunday, April 11",,Day 2 Opening Remarks,14:00-14:05,,2,,,,,,
Performance,"Sunday, April 11",,Tsugaru Shamisen - Keio,14:05-14:15,Music,2,,,,,,
Performance,"Sunday, April 11",,Amusement Parks,14:15-14:25,Culture,2,,,,,,
Performance,"Sunday, April 11",,Cooking Demo - Agedashi Tofu,14:25-14:30,Food,2,,,,,,
Performance,"Sunday, April 11",,Shakuhachi - Devon Osamu Tipp,14:30-14:36,Music,2,,,,,,
Performance,"Sunday, April 11",,Origami,14:36-14:48,Art,2,,,,,,
Performance,"Sunday, April 11",,Street Culture,14:48-14:53,Culture,2,,,,,,
Performance,"Sunday, April 11",,Acchimuitehoi,14:53-14:55,Games,2,,,,,,
Performance,"Sunday, April 11",,Nihon Buyo - Hanaka,14:55-15:15,Art,2,,,,,,
Performance,"Sunday, April 11",,Tokyo Drift,15:15-15:20,Music,2,,,,,,
Performance,"Sunday, April 11",,Chado - Yuko Eguchi Wright,15:20-15:30,Culture,2,,,,,,
Performance,"Sunday, April 11",,Shuntou,15:30-15:35,Music,2,,,,,,
Performance,"Sunday, April 11",,Matsuri (& 3.11) Ending Remarks,15:35-15:45,,2,,,,,,
     */
    render() {
        return (
            <div>
                <h1>Schedule</h1>

                <h2>Date, Time, and Location</h2>

                <p>
                    Matsuri 2022&apos;s events will all be held on Saturday, April 16th.
                </p>
                

                <p>
                    
                    Please check back later for a more detailed schedule
                </p>
                <ScheduleTable />
                <br />
            </div>
        );
    }
}