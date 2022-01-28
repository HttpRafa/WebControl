package net.rafael.web.control.command.commands

import net.rafael.web.control.WebControl
import net.rafael.web.control.command.AbstractCommand

//------------------------------
//
// This class was developed by Rafael K.
// On 1/25/2022 at 6:01 PM
// In the project WebControl
//
//------------------------------

class SaveCommand(name: String) : AbstractCommand(name) {

    override fun execute(args: Array<String>) {

        WebControl.logger.info("Saving everything...")
        WebControl.webControl.save()

    }

}