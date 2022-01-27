package net.rafael.web.control.command.commands

import net.rafael.web.control.WebControl
import net.rafael.web.control.classes.MethodResult
import net.rafael.web.control.command.executor.Command
import net.rafael.web.control.interfaces.ObjectRunnable
import net.rafael.web.control.setup.classes.ConsoleSetup
import net.rafael.web.control.setup.classes.ConsoleSetupStep
import net.rafael.web.control.user.User

//------------------------------
//
// This class was developed by Rafael K.
// On 1/25/2022 at 6:01 PM
// In the project WebControl
//
//------------------------------

class SaveCommand(name: String, usage: String?, description: String) : Command(name, usage, description) {

    override fun execute(args: Array<String>) {

        WebControl.logger.info("Saving everything...")
        WebControl.webControl.save()

    }

}