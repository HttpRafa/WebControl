import TopNavigation from '../sidebar/TopNavigation';

const ServerContent = () => {
  return (
    <div className='content-container'>
      <TopNavigation title={"Home"}/>
      <div className='content-list'>
          <div className="mt-9 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
              <h2 className="text-3xl font-extralight tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  <span className="block">Please use the sidebar to navigate in the dashboard</span>
              </h2>
          </div>
      </div>
    </div>
  );
};

export default ServerContent;
