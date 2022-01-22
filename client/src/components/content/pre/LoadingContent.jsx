import TopNavigation from '../../sidebar/TopNavigation';

const LoadingContent = () => {
  return (
    <div className='content-container'>
      <TopNavigation title={"Home"}/>
      <div className='content-list'>
          <div className="mt-9 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
              <div className="lds-ellipsis">
                  <div/>
                  <div/>
                  <div/>
                  <div/>
              </div>
          </div>
      </div>
    </div>
  );
};

export default LoadingContent;
