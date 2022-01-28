package net.rafael.web.control.command.manager

import net.rafael.web.control.WebControl
import net.rafael.web.control.classes.MethodResult
import net.rafael.web.control.command.AbstractCommand
import net.rafael.web.control.console.input.task.InputTask
import net.rafael.web.control.console.input.task.InputTaskCallback
import net.rafael.web.control.console.interfaces.IApplicationLoggingService
import java.util.*
import java.util.stream.Collectors

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
                if(line.isNotEmpty() && line.isNotBlank()) {
                    val command = line.split(" ")[0]
                    var args = line.split(" ").toList().toMutableList()
                    args.removeFirst()
                    args = args.filterNot { item -> item.isEmpty() || item.isBlank() } as MutableList<String>

                    val abstractCommands = commandList.stream().filter {
                        item -> item.name.equals(command, ignoreCase = true) || item.hasAlias(command)
                    }.collect(Collectors.toList())

                    if(abstractCommands.size > 1) WebControl.logger.warning("§7The entered command§8[§c$command§8] §7has more than one meaning§8.")
                    if(abstractCommands.size > 0) abstractCommands[0].execute(args.toTypedArray())
                    if(abstractCommands.size == 0) WebControl.logger.error("§cCommand not found§8. §cUse the command §8\"§4help§8\"§c for further information§8!")
                }

                return MethodResult<Boolean>().of(false, false)
            }
        }))
    }

    fun wrongUsageWarning(abstractCommand: AbstractCommand) {
        val usageList = mutableListOf<String>()
        for (commandUsage in abstractCommand.getUsage()) {
            val usageStringBuilder = StringBuilder()
            for (action in commandUsage.getActionsList()) {
                usageStringBuilder.append("§3$action§8, ")
            }
            var usageString = usageStringBuilder.toString()
            if(commandUsage.getActionsList().isNotEmpty()) usageString = "§8<" + usageString.substring(0, usageString.length - 4) + "§8>"
            usageList.add(usageString)
        }
        val usageStringBuilder = StringBuilder()
        for (usage in usageList) {
            usageStringBuilder.append(usage).append(" ")
        }

        WebControl.logger.warning("§cYou used the command wrongly§8!")
        WebControl.logger.warning("§7Please use it like that§8: §7" + abstractCommand.name + " " + usageStringBuilder.toString().trim())
    }

    fun registerCommand(command: AbstractCommand) {
        commandList.add(command)
    }

    fun getCommandList(): List<AbstractCommand> {
        return commandList
    }
}