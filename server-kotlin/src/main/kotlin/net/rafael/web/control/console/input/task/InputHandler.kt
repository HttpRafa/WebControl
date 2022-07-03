package net.rafael.web.control.console.input.task

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 3:35 PM
// In the project WebControl
//
//------------------------------

class InputHandler(val priority: Int, val callback: InputHandlerCallback) {

    companion object {
        const val PRIORITY_VERY_HIGH = 0
        const val PRIORITY_HIGH = 1
        const val PRIORITY_NORMAL = 2
        const val PRIORITY_LOW = 3
        const val PRIORITY_VERY_LOW = 4
        const val PRIORITY_ZERO = 5
    }

}