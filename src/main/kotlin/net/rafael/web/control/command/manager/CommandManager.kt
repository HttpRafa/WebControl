package net.rafael.web.control.command.manager

import net.rafael.web.control.WebControl
import net.rafael.web.control.classes.MethodResult
import net.rafael.web.control.command.AbstractCommand
import net.rafael.web.control.console.input.task.InputTask
import net.rafael.web.control.console.input.task.InputTaskCallback
import net.rafael.web.control.console.interfaces.IApplicationLoggingService

//------------------------------
//
// This class was developed by Rafael K.
// On 1/25/2022 at 5:07 PM
// In the project WebControl
//
//------------------------------

class CommandManager(service: IApplicationLoggingService) {

    private val commandList: MutableList<AbstractCommand> = mutableListOf()

    init {
        service.getConsoleThread().registerTask(InputTask(InputTask.PRIORITY_ZERO, object : InputTaskCallback {
            override fun run(line: String): MethodResult<Boolean> {
                return MethodResult<Boolean>().of(false, false)
            }
        }))
    }

    fun wrongUsageWarning(command: AbstractCommand) {
        WebControl.logger.warning("§cYou used the command wrongly§8!")
        WebControl.logger.warning("§7Please use it like that§8: §7" + command.name + " " + command.getUsage())
    }

    fun registerCommand(command: AbstractCommand) {
        commandList.add(command)
    }

    fun getCommandList(): List<AbstractCommand> {
        return commandList
    }
}