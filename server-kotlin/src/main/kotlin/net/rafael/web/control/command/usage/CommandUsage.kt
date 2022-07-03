package net.rafael.web.control.command.usage

import java.util.ArrayList

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 4:27 PM
// In the project WebControl
//
//------------------------------

class CommandUsage {

    private val actionsList: MutableList<String>

    init {
        actionsList = ArrayList()
    }

    fun add(action: String): CommandUsage {
        actionsList.add(action)
        return this
    }

    fun getActionsList(): List<String> {
        return actionsList
    }

}