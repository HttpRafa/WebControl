import InputOptionModal from "../modals/InputOptionModal";
import React, { useState } from "react";

import { FiDatabase } from 'react-icons/fi';
import { MdModeEdit } from "react-icons/md";

const ApplicationOptions = ( { options, changeCallback }) => {

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedOptionValue, setSelectedOptionValue] = useState("");

    return (
        <>
            <div className="ml-4 mb-4 mr-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {
                    options.map(option => {
                        return (
                            <div className="bg-gray-200 dark:bg-gray-800 shadow-sm rounded pt-4 pb-4 pl-2">
                                <div className="flex">
                                    <div className="cursor-pointer mr-2 text-green-500 w-12 h-12 flex justify-center items-center">
                                        <FiDatabase size='22' className="" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-xlss text-gray-800 dark:text-gray-300">{option.name}</div>
                                        <p className="mt-1 bg-transparent focus:outline-0 font-bold text-xls text-gray-800 dark:text-gray-300">{option.value}</p>
                                    </div>
                                    <div onClick={() => {
                                        setShowEditModal(true);
                                        setSelectedOption(option.name);
                                        setSelectedOptionValue(option.value);
                                    }} className="ml-auto mr-4 relative flex items-center justify-center h-12 w-12 bg-gray-400 hover:bg-blue-600 dark:bg-gray-900 text-blue-500 hover:text-white hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg">
                                        <MdModeEdit size='22' className="" />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <InputOptionModal show={showEditModal} icon="#" defaultValue={selectedOptionValue} valueName={selectedOption} title="Edit option" message="Change the value of an option" buttonMessage="Apply" callBack={() => {
                setShowEditModal(false);
                changeCallback(selectedOption, selectedOptionValue);
            }} />
        </>
    );
}

export default ApplicationOptions;