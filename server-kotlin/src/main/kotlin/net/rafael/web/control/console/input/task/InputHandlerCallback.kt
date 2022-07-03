package net.rafael.web.control.console.input.task

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 3:36 PM
// In the project WebControl
//
//------------------------------

interface InputHandlerCallback {

    fun run(event: ConsoleInputEvent): ConsoleInputEvent

}