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

class UserCommand(name: String, usage: String?, description: String) : Command(name, usage, description) {

    override fun execute(args: Array<String>) {

        if(args.size == 2) {
            if(args[0] == "add") {
                val username: String = args[1]

                val setup: ConsoleSetup = ConsoleSetup(
                    object : ObjectRunnable<ConsoleSetup, Any> {
                        override fun run(t: ConsoleSetup): Any {
                            val result: MethodResult<User> = WebControl.webControl.getUserManager().createUser(username, t.getSteps()[0].value as String)
                            if(result.isObjectEmpty) {
                                WebControl.logger.error("§cFailed to create user§8!")
                            } else {
                                WebControl.logger.info("User §acreated§8[§7username§8: §b$username§8]")
                            }
                            return "null"
                        }
                    }, ConsoleSetupStep("Please write the password that the user should become into the console§8.",
                    object : ObjectRunnable<String, MethodResult<Any>> {
                        override fun run(t: String): MethodResult<Any> {
                            return MethodResult<Any>().of(true, t, "Nothing to say $t")
                        }
                    }))

                WebControl.webControl.getConsoleSetupManager().addSetup(setup)
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
        WebControl.webControl.getCommandManager().defaultCommandWrongUsageWarning(this)

    }

}