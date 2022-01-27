package net.rafael.web.control.setup

import net.rafael.web.control.WebControl
import net.rafael.web.control.interfaces.ObjectRunnable
import net.rafael.web.control.setup.classes.ConsoleSetup
import java.util.ArrayList

//------------------------------
//
// This class was developed by Rafael K.
// On 1/26/2022 at 5:27 PM
// In the project WebControl
//
//------------------------------

class ConsoleSetupManager {

    private val setups: MutableList<ConsoleSetup> = mutableListOf()

    fun addSetup(setup: ConsoleSetup) {
        setup.finishedCallback(object : ObjectRunnable<ConsoleSetup, Any> {
            override fun run(t: ConsoleSetup): Any {
                setPromptIcon()
                return ""
            }
        })
        setups.add(setup)
        setup.init()
        setPromptIcon()
    }

    private fun setPromptIcon() {
        if(setups.size > 0) {
            WebControl.webControl.getCommandManager().changePromptIcon("-")
        } else {
            WebControl.webControl.getCommandManager().resetPromptIcon()
        }
    }

    fun getSetups(): MutableList<ConsoleSetup> {
        return setups
    }

}