package net.rafael.web.control.console.input.task

import net.rafael.web.control.console.input.task.ConsoleInputEvent

//------------------------------
//
// This class was developed by Rafael K.
// On 2/6/2022 at 10:24 AM
// In the project WebControl
//
//------------------------------
class ConsoleInputEvent(val line: String) {

    var isRemove = false
        private set

    var isCancelled = false

    fun reset() {
        isRemove = false
    }

    fun remove(): ConsoleInputEvent {
        isRemove = true
        return this
    }

    fun cancel(): ConsoleInputEvent {
        isCancelled = true
        return this
    }

}