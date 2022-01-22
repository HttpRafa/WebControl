import TopNavigation from '../sidebar/TopNavigation';
import CancelRedOptionModal from '../modals/CancelRedOptionModal';
import {AiFillDelete} from "react-icons/ai";
import {MdModeEdit, MdAdd} from "react-icons/md";
import React, { useState } from "react";

const ServerContent = ( { clickAdd } ) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(undefined);

    return (
        <div className='content-container'>
            <TopNavigation title={"Access"}/>
            <div className='content-list'>
                <div className="mr-9 ml-9 mt-9 mb-9 mb-24 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Application Access</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Here you can specify with user can access your application</p>
                    </div>
                    <div className="ml-4 mb-4 mr-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-gray-200 dark:bg-gray-800 shadow-sm rounded pt-4 pb-4 pl-2">
                            <div className="flex">
                                <div className="ml-4 flex justify-center items-center">
                                    <div className="font-medium lg:text-xls sm:text-xs text-gray-800 dark:text-gray-300">xZerroo</div>
                                </div>
                                <div className="ml-auto mr-0 relative flex items-center justify-center h-12 w-12 bg-gray-400 hover:bg-blue-600 dark:bg-gray-900 text-blue-500 hover:text-white hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg">
                                    <MdModeEdit size='22' className="" />
                                </div>
                                <div onClick={event => {
                                    setShowDeleteModal(true);
                                }} className="ml-2 mr-4 relative flex items-center justify-center h-12 w-12 bg-gray-400 hover:bg-red-600 dark:bg-gray-900 text-red-500 hover:text-white hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg">
                                    <AiFillDelete size='22' className="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <BottomBar clickAdd={clickAdd} />
                </div>
            </div>
            <CancelRedOptionModal icon={(
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
            )} title="Remove access" message="With this action, all rights are revoked from the define user" buttonMessage="Remove" show={showDeleteModal} callBack={(result) => {
                setShowDeleteModal(false);
            }}/>
        </div>
    );
};

const BottomBar = ( { clickAdd } ) => (
    <form className='bottom-bar' onSubmit={event => {
        event.preventDefault();
        clickAdd();
    }}>
        <input type='text' id="access-input" placeholder='Enter username...' className='bottom-bar-input' />
        <AddIcon clickAdd={clickAdd} />
    </form>
);

const AddIcon = ( {clickAdd} ) => {
    return (
        <div onClick={clickAdd}>
            <MdAdd
                size='26'
                className='text-green-500 mx-2 dark:text-primary cursor-pointer'
            />
        </div>
    );
};

export default ServerContent;
