import { FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import { CgFormatSlash } from 'react-icons/cg';
import useDarkMode from '../../hooks/useDarkMode';

const TopNavigation = ( { title } ) => {
  return (
    <div className='top-navigation'>
        <Title title={title}/>
        <ThemeIcon />
        <UserCircle />
    </div>
  );
};

const ThemeIcon = () => {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => setDarkTheme(!darkTheme);
  return (
    <span onClick={handleMode}>
      {darkTheme ? (
        <FaSun size='24' className='top-navigation-icon' />
      ) : (
        <FaMoon size='24' className='top-navigation-icon' />
      )}
    </span>
  );
};

const UserCircle = () => <FaUserCircle size='24' className='top-navigation-icon' />;
const SlashIcon = () => <CgFormatSlash size='28' className='title-slash' />;
const Title = ({ title }) => {
    return (
        <>
            <p className='title-text-root'>WebControl</p>
            <SlashIcon />
            <h5 className='title-text'>{title}</h5>
        </>
    );
};

export default TopNavigation;
