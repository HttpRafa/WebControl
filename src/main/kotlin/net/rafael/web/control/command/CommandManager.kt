package net.rafael.web.control.command

import net.rafael.web.control.WebControl
import net.rafael.web.control.command.executor.Command
import net.rafael.web.control.logging.ApplicationLogger
import net.rafael.web.control.logging.color.ConsoleColor
import net.rafael.web.control.setup.classes.ConsoleSetup

//------------------------------
//
// This class was developed by Rafael K.
// On 1/25/2022 at 5:07 PM
// In the project WebControl
//
//------------------------------

class CommandManager(logger: ApplicationLogger) {

    private val defaultPrompt = "§8[ §b%user%§8@§3Web§bControl §8] §7%icon% "
    private var prompt = "§8[ §b%user%§8@§3Web§bControl §8] §7%icon% "

    private val defaultPromptIcon = "#"
    private var promptIcon = "#"

    private val commandList: MutableList<Command> = mutableListOf()

    init {
        Thread({
            val user = System.getProperty("user.name")
            var commandLine: String
            try {
                while (true) {
                    while (logger.readLine(ConsoleColor.toColouredString('§', prompt.replace("%user%", user).replace("%icon%", promptIcon))).also { commandLine = it!! } != null) {
                        if (!commandLine.equals("", ignoreCase = true)) {
                            if(WebControl.webControl.getConsoleSetupManager().getSetups().isEmpty()) {
                                val key = commandLine.split(" ".toRegex()).toTypedArray()[0]
                                val selected = commandList.stream().filter { command: Command -> command.name.equals(key.trim { it <= ' ' }, ignoreCase = true) }.toList()
                                if (selected.size == 0) {
                                    logger.error("§cCommand not found§8. §cUse the command §8\"§4help§8\"§c for further information§8!")
                                } else {
                                    for (command in selected) {
                                        var args = commandLine.replace(key.toRegex(), "").trim { it <= ' ' }.split(" ".toRegex()).toTypedArray()
                                        if (args.size == 1) {
                                            if (args[0].equals("", ignoreCase = true) || args[0].equals(" ", ignoreCase = true)) {
                                                args = arrayOf()
                                            }
                                        }
                                        command.execute(args)
                                    }
                                }
                            } else {
                                val iterator: MutableIterator<ConsoleSetup> = WebControl.webControl.getConsoleSetupManager().getSetups().iterator()
                                while (iterator.hasNext()) {
                                    val setup: ConsoleSetup = iterator.next()
                                    if(setup.nextStep(commandLine)) iterator.remove()
                                }
                            }
                        }
                    }
                }
            } catch (ignored: Exception) {
                WebControl.logger.handleException(ignored)
            }
        }, "Command Thread").start()
    }

    fun changePromptIcon(icon: String) {
        this.promptIcon = icon
    }

    fun resetPromptIcon() {
        this.promptIcon = this.defaultPromptIcon
    }

    fun changePrompt(prompt: String) {
        this.prompt = prompt
    }

    fun resetPrompt() {
        this.prompt = this.defaultPrompt
    }

    fun defaultCommandWrongUsageWarning(command: Command) {
        WebControl.logger.warning("§cYou used the command wrongly§8!")
        WebControl.logger.warning("§7Please use it like that§8: §7" + command.name + " " + command.usage)
    }

    fun registerCommand(command: Command) {
        commandList.add(command)
    }

    fun getCommandList(): List<Command> {
        return commandList
    }
}