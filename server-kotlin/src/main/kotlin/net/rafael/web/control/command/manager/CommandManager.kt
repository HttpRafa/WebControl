package net.rafael.web.control.command.manager

import net.rafael.web.control.WebControl
import net.rafael.web.control.classes.MethodResult
import net.rafael.web.control.command.AbstractCommand
import net.rafael.web.control.console.input.task.ConsoleInputEvent
import net.rafael.web.control.console.input.task.InputHandler
import net.rafael.web.control.console.input.task.InputHandlerCallback
import net.rafael.web.control.console.interfaces.IApplicationConsole
import java.util.stream.Collectors

//------------------------------
//
// This class was developed by Rafael K.
// On 1/25/2022 at 5:07 PM
// In the project WebControl
//
//------------------------------

class CommandManager(service: IApplicationConsole) {

    private val commandList: MutableList<AbstractCommand> = mutableListOf()

    init {
        service.getConsoleThread().registerTask(InputHandler(InputHandler.PRIORITY_ZERO, object : InputHandlerCallback {
            override fun run(event: ConsoleInputEvent): ConsoleInputEvent {
                if(!event.isCancelled) {
                    if(event.line.isNotEmpty() && event.line.isNotBlank()) {
                        val command = event.line.split(" ")[0]
                        var args = event.line.split(" ").toList().toMutableList()
                        args.removeFirst()
                        args = args.filterNot { item -> item.isEmpty() || item.isBlank() } as MutableList<String>

                        val abstractCommands = commandList.stream().filter {
                                item -> item.name.equals(command, ignoreCase = true) || item.hasAlias(command)
                        }.collect(Collectors.toList())

                        if(abstractCommands.size > 1) WebControl.logger.warning("§7The entered command§8[§c$command§8] §7has more than one meaning§8.")
                        if(abstractCommands.size > 0) abstractCommands[0].execute(args.toTypedArray())
                        if(abstractCommands.size == 0) WebControl.logger.error("§cCommand not found§8. §cUse the command §8\"§4help§8\"§c for further information§8!")
                    }
                }
                return event
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