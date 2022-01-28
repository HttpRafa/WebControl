package net.rafael.web.control.command.commands

import net.rafael.web.control.WebControl
import net.rafael.web.control.command.AbstractCommand

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 4:35 PM
// In the project WebControl
//
//------------------------------

class UserCommand(name: String) : AbstractCommand(name) {

    override fun execute(args: Array<String>) {
        if(args.size == 2) {
            if(args[0] == "add") {
                val username: String = args[1]
                return
            } else if(args[0] == "delete") {
                val username: String = args[1]
                return
            } else if(args[0] == "info") {
                val username: String = args[1]
                return
            } else {
                return
            }
        }
        WebControl.webControl.commandManager.wrongUsageWarning(this)
    }

}