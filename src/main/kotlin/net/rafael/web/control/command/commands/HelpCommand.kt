package net.rafael.web.control.command.commands

import net.rafael.web.control.command.AbstractCommand

//------------------------------
//
// This class was developed by Rafael K.
// On 1/25/2022 at 5:08 PM
// In the project WebControl
//
//------------------------------

class HelpCommand(name: String) : AbstractCommand(name) {

    override fun execute(args: Array<String>) {
        /*val logger = WebControl.logger
        logger.info("All executable commands:")
        for (command in WebControl.webControl.getCommandManager().getCommandList()) {
            logger.info("§8- §7" + command.name + (if (command.usage != null) " " + command.usage else "") + " §8| §7" + command.description)
        }
        // TODO: Fix
         */
    }

}