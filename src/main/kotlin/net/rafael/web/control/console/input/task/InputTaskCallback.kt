package net.rafael.web.control.console.input.task

import net.rafael.web.control.classes.MethodResult

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 3:36 PM
// In the project WebControl
//
//------------------------------

interface InputTaskCallback {

    fun run(line: String): MethodResult<Boolean>

}