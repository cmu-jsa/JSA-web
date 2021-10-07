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
 
        let csvData = require('./careerSchedule.csv');
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
            case 'English':
                color = 'green';
                break;
            case 'Japanese':
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
 
export default ScheduleTable;