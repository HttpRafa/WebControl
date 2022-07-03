package net.rafael.web.control.command.commands

import net.rafael.web.control.WebControl
import net.rafael.web.control.classes.MethodResult
import net.rafael.web.control.command.AbstractCommand
import net.rafael.web.control.console.input.task.ConsoleInputEvent
import net.rafael.web.control.console.input.task.InputHandler
import net.rafael.web.control.console.input.task.InputHandlerCallback
import net.rafael.web.control.user.User

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
                if(WebControl.webControl.userManager.isUsernameFree(username)) {
                    WebControl.logger.info("Please enter the password for the user§8: ")
                    WebControl.logger.getConsole().getConsoleThread().registerTask(InputHandler(InputHandler.PRIORITY_VERY_HIGH, object : InputHandlerCallback {
                        override fun run(event: ConsoleInputEvent): ConsoleInputEvent {
                            if(WebControl.webControl.userManager.passwordStrength(event.line) >= 2) {
                                WebControl.webControl.userManager.add(User.create(username, event.line))
                                return event.remove().cancel()
                            } else {
                                WebControl.logger.error("The password is too §cweak§8.")
                                return event.cancel()
                            }
                        }
                    }))
                } else {
                    WebControl.logger.error("§7A user with this username §calready §7exists§8.")
                }
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