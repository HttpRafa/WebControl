package net.rafael.web.control.command

import net.rafael.web.control.command.usage.CommandUsage

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 4:26 PM
// In the project WebControl
//
//------------------------------

abstract class AbstractCommand(val name: String) {

    private val aliases: MutableList<String> = mutableListOf()
    private val usage: MutableList<CommandUsage> = mutableListOf()
    var description: String
        private set

    init {
        description = ""
    }

    fun withAlias(alias: String): AbstractCommand {
        aliases.add(alias)
        return this
    }

    fun withUsage(usage: CommandUsage): AbstractCommand {
        this.usage.add(usage)
        return this
    }

    fun withDescription(description: String): AbstractCommand {
        this.description = description
        return this
    }

    open fun execute(args: Array<String>) {

    }

    fun getUsage(): List<CommandUsage> {
        return usage
    }

    fun getAliases(): List<String> {
        return aliases
    }

    fun hasAlias(value: String): Boolean {
        return getAliases().stream().anyMatch { item -> item.equals(value, ignoreCase = true) }
    }

}