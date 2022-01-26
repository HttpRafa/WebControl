package net.rafael.web.control

import net.rafael.web.control.command.CommandManager
import net.rafael.web.control.command.commands.UserCommand
import net.rafael.web.control.command.commands.ClearCommand
import net.rafael.web.control.command.commands.HelpCommand
import net.rafael.web.control.command.commands.StopCommand
import net.rafael.web.control.config.ConfigManager
import net.rafael.web.control.logging.ApplicationLogger
import net.rafael.web.control.logging.color.ConsoleColor
import net.rafael.web.control.setup.ConsoleSetupManager
import net.rafael.web.control.user.UserManager
import java.io.File
import kotlin.system.exitProcess

//------------------------------
//
// This class was developed by Rafael K.
// On 1/20/2022 at 1:29 PM
// In the project WebControl
//
//------------------------------

class WebControl(args: Array<String>) {

    private lateinit var configManager: ConfigManager
    private lateinit var commandManager: CommandManager
    private lateinit var userManager: UserManager
    private lateinit var consoleSetupManager: ConsoleSetupManager

    init {

        webControl = this
        logger = ApplicationLogger()

    }

    fun start() {

        configManager = ConfigManager(File("configs/"), File("configs/config.json"))
        commandManager = CommandManager(logger)
        consoleSetupManager = ConsoleSetupManager()

        load()

        // Register commandList
        commandManager.registerCommand(HelpCommand("help", null, "Displays all executable commands"))
        commandManager.registerCommand(UserCommand("user", "§8<§badd§7, §bdelete§7, §binfo§8> §8<§busername§8>", "Create user of the interface"))
        commandManager.registerCommand(ClearCommand("clear", null, "Deletes the displayed console"))
        commandManager.registerCommand(ClearCommand("cls", null, "Deletes the displayed console"))
        commandManager.registerCommand(StopCommand("stop", null, "Stops the WebControl application"))
        commandManager.registerCommand(StopCommand("exit", null, "Stops the WebControl application"))

        // Register Shutdown Hook
        Runtime.getRuntime().addShutdownHook(Thread {
            logger.info("Application is shutting down...")

            logger.info("Stopping WebSocketServer...")
            // TODO: Shutdown the WebSocketServer

            logger.info("Saving everything...")
            save()

            logger.info("Bye :)")
            println(ConsoleColor.toColouredString('§', "§r"))
        })

    }

    fun exit() {
        exitProcess(0)
    }

    private fun load() {
        userManager = UserManager.load()
    }

    private fun save() {
        userManager.save()
    }

    fun getCommandManager(): CommandManager {
        return commandManager
    }

    fun getConsoleSetupManager(): ConsoleSetupManager {
        return consoleSetupManager
    }

    fun getUserManager(): UserManager {
        return userManager
    }

    fun getConfigManager(): ConfigManager {
        return configManager
    }

    companion object {
        lateinit var webControl: WebControl private set
        lateinit var logger: ApplicationLogger private set
    }

}