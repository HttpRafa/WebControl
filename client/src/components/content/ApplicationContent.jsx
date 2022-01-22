import TopNavigation from '../sidebar/TopNavigation';
import ApplicationStats from '../server/ApplicationStats';
// import { useState } from 'react';

const ApplicationContent = ({ applicationState, webSocketManager }) => {
    return (
        <div className='content-container'>
            <TopNavigation title={"Application"}/>
            <ApplicationStats applicationState={applicationState} />
        </div>
    );
};

export default ApplicationContent;
