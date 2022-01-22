import { BsPlus, BsFillCpuFill, BsServer } from 'react-icons/bs';
import { FaFolderOpen, FaHome } from 'react-icons/fa';
import { FiUser, FiSettings } from 'react-icons/fi';
import { SiWindowsterminal } from 'react-icons/si';
import { CgOptions } from 'react-icons/cg';

const SideBar = ({ hideSideBar, iconClickCallback }) => {
  return (
      <div className="fixed top-0 left-0 h-screen w-16 flex flex-col
                  bg-white dark:bg-gray-900 shadow-lg">
                    
        <SideBarIcon hide={false} icon={<FaHome size="28" />} text={"Home"} click={function () {
            if(hideSideBar.includes(-1)) {
                return;
            }
            iconClickCallback(-1);
        }}/>
        <Divider hide={hideSideBar.includes(-1) || hideSideBar.includes(1)} />
        <SideBarIcon hide={hideSideBar.includes(-1) || hideSideBar.includes(1)} icon={<BsFillCpuFill size="20" />} text={"Application"} click={function () {
            if(hideSideBar.includes(-1)) {
                return;
            }
            iconClickCallback(-2);
        }}/>
        <SideBarIcon hide={hideSideBar.includes(-1) || hideSideBar.includes(2)} icon={<CgOptions size="20" />} text={"Options"} click={function () {
            if(hideSideBar.includes(-1)) {
                return;
            }
            iconClickCallback(-3);
        }}/>
        <SideBarIcon hide={hideSideBar.includes(-1) || hideSideBar.includes(3)} icon={<SiWindowsterminal size="20" />} text={"Console"} click={function () {
            if(hideSideBar.includes(-1)) {
                return;
            }
            iconClickCallback(-4);
        }} />
        <SideBarIcon hide={hideSideBar.includes(-1) || hideSideBar.includes(4)} icon={<FaFolderOpen size="20" />} text={"Files"} click={function () {
            if(hideSideBar.includes(-1)) {
                return;
            }
            iconClickCallback(-5);
        }}/>
        <SideBarIcon hide={hideSideBar.includes(-1) || hideSideBar.includes(5)} icon={<FiUser size="20" />} text={"Access"} click={function () {
            if(hideSideBar.includes(-1)) {
                return;
            }
            iconClickCallback(-6);
        }}/>
        <Divider hide={hideSideBar.includes(-1)} />
        <SideBarIcon hide={hideSideBar.includes(-1)} icon={<BsPlus size="32" />} text={"Create Application"} click={function () {
            if(hideSideBar.includes(-1)) {
                return;
            }
            iconClickCallback(-7);
        }} />
        <SideBarIcon hide={hideSideBar.includes(-1)} icon={<BsServer size="20" />} text={"Example Application"} click={function () {
            if(hideSideBar.includes(-1)) {
                return;
            }
            iconClickCallback(0);
        }} />
        <Divider hide={hideSideBar.includes(-1)}/>
        <SideBarIcon hide={hideSideBar.includes(-1)} icon={<FiSettings size="22" />} text={"Settings"} click={function () {
            if(hideSideBar.includes(-1)) {
                return;
            }
            iconClickCallback(-8);
        }} />
    </div>
  );
};

const SideBarIcon = ({ hide, icon, text, click }) => {
    if(hide) {
        return (
            <div className="hidden sidebar-icon group" onClick={click}>
                {icon}
                <span className="sidebar-tooltip group-hover:scale-100">
            {text}
            </span>
            </div>
        )
    }
    return (
        <div className="sidebar-icon group" onClick={click}>
            {icon}
            <span className="sidebar-tooltip group-hover:scale-100">
            {text}
            </span>
        </div>
    )
};


const Divider = ( { hide } ) => {
    if(hide) {
        return <hr className="hidden sidebar-hr" />
    }
    return <hr className="sidebar-hr" />
};

export default SideBar;
