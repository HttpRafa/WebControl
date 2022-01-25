package net.rafael.web.control.command.commands

import net.rafael.web.control.WebControl
import net.rafael.web.control.command.executor.Command

//------------------------------
//
// This class was developed by Rafael K.
// On 1/25/2022 at 5:08 PM
// In the project WebControl
//
//------------------------------

class ClearCommand(name: String, usage: String?, description: String) : Command(name, usage, description) {

    override fun execute(args: Array<String>) {
        WebControl.logger.clearConsole()
    }

}