package net.rafael.web.control

import net.rafael.web.control.application.ApplicationManager
import net.rafael.web.control.command.commands.*
import net.rafael.web.control.command.manager.CommandManager
import net.rafael.web.control.command.usage.CommandUsage
import net.rafael.web.control.console.interfaces.IApplicationLogger
import net.rafael.web.control.console.logger.ApplicationLogger
import net.rafael.web.control.network.NetworkServer
import net.rafael.web.control.user.UserManager
import java.net.InetSocketAddress
import kotlin.system.exitProcess


//------------------------------
//
// This class was developed by Rafael K.
// On 1/20/2022 at 1:29 PM
// In the project WebControl
//
//------------------------------

class WebControl(args: Array<String>) {

    lateinit var commandManager: CommandManager
    lateinit var networkServer: NetworkServer
    lateinit var userManager: UserManager
    lateinit var applicationManager: ApplicationManager

    init {

        webControl = this
        logger = ApplicationLogger()

    }

    fun start() {

        // Register Shutdown Hook
        Runtime.getRuntime().addShutdownHook(Thread {
            exit(false)
        })

        // Register UncaughtExceptionHandler
        Thread.currentThread().setUncaughtExceptionHandler { thread, exception ->
            run {
                logger.error(exception)
            }
        }

        commandManager = CommandManager(logger.getConsole())
        networkServer = NetworkServer(InetSocketAddress(3388))
        userManager = UserManager()
        applicationManager = ApplicationManager()

        load()

        // Register commandList
        commandManager.registerCommand(HelpCommand("help").withDescription("Displays all executable commands"))
        commandManager.registerCommand(UserCommand("user").withUsage(
            CommandUsage().add("add").add("delete").add("info")
        ).withUsage(
            CommandUsage().add("username")
        ).withDescription("Create user of the interface"))
        commandManager.registerCommand(SaveCommand("save").withDescription("Saves everything"))
        commandManager.registerCommand(DebugCommand("debug").withAlias("dev").withDescription("Enables debug mode"))
        commandManager.registerCommand(ClearCommand("clear").withAlias("cls").withDescription("Deletes the displayed console"))
        commandManager.registerCommand(StopCommand("stop").withAlias("exit").withAlias("end").withDescription("Stops the WebControl application"))

        // Start NetworkServer
        networkServer.start()

    }

    fun exit(exitProcess: Boolean) {
        if(!stopping) {
            stopping = true

            logger.info("Application is shutting down...")

            logger.info("Stopping WebSocketServer...")
            // TODO: Shutdown the WebSocketServer

            logger.info("Saving everything...")
            save()

            logger.info("Bye :)")
            if(exitProcess) exitProcess(0)
        }
    }

    fun load() {
        userManager.loadUsers()
        applicationManager.loadApplications()
    }

    fun save() {
        userManager.saveUsers()
    }

    companion object {
        lateinit var webControl: WebControl private set
        lateinit var logger: IApplicationLogger private set
        var stopping: Boolean = false
    }

}