package net.rafael.web.control.console.input.task

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 3:35 PM
// In the project WebControl
//
//------------------------------

class InputTask(val priority: Int, val callback: InputTaskCallback) {

    companion object {
        val PRIORITY_VERY_HIGH = 7
        val PRIORITY_HIGH = 6
        val PRIORITY_NORMAL = 5
        val PRIORITY_LOW = 4
        val PRIORITY_VERY_LOW = 3
        val PRIORITY_ZERO = 0
    }

}