package net.rafael.web.control.command.commands

import net.rafael.web.control.WebControl
import net.rafael.web.control.command.AbstractCommand

//------------------------------
//
// This class was developed by Rafael K.
// On 1/25/2022 at 5:08 PM
// In the project WebControl
//
//------------------------------

class ClearCommand(name: String) : AbstractCommand(name) {

    override fun execute(args: Array<String>) {
        if(WebControl.logger.getConsole().isReadyToClear()) {
            WebControl.logger.getConsole().clearConsole()
        } else {
            WebControl.logger.error("§7You cant clear the console while an animation is running§8.")
        }
    }

}