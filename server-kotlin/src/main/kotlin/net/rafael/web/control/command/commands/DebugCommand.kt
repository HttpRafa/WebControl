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

class DebugCommand(name: String) : AbstractCommand(name) {

    override fun execute(args: Array<String>) {
        if(WebControl.logger.getDebuggingState()) {
            WebControl.logger.debug("§7The §bdebug mode §7has been §cdeactivated§8.")
            WebControl.logger.disableDebugging()
        } else {
            WebControl.logger.enableDebugging()
            WebControl.logger.debug("§7The §bdebug mode §7has been §aactivated§8.")
        }
    }

}