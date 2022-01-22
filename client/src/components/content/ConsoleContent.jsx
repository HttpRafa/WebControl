import TopNavigation from '../sidebar/TopNavigation';
import { BiSend } from 'react-icons/bi';

const ServerContent = ( { messages, clickSend } ) => {
    return (
        <div className='content-container'>
            <TopNavigation title={"Console"}/>
                <div className='content-list'>
                    <div className="console">
                        {
                            messages.map(message => {
                                return (
                                    <ConsoleMessage text={message}/>
                                );
                            })
                        }
                    </div>
                </div>
            <BottomBar clickSend={clickSend} />
        </div>
  );
};

const BottomBar = ( { clickSend } ) => (
  <form className='bottom-bar' onSubmit={event => {
      event.preventDefault();
      clickSend();
  }}>
      <input type='text' id="console-input" placeholder='Enter command...' className='bottom-bar-input' />
      <SendIcon clickSend={clickSend} />
  </form>
);

const ConsoleMessage = ({ text }) => {
  return (
      <div className="console-line">{text}</div>
  );
};

const SendIcon = ( {clickSend} ) => {
    return (
        <div onClick={clickSend}>
            <BiSend
                size='22'
                className='text-green-500 mx-2 dark:text-primary cursor-pointer'
            />
        </div>
    );
};

export default ServerContent;
