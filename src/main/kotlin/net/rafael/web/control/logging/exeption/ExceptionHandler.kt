package net.rafael.web.control.logging.exeption

import net.rafael.web.control.logging.ApplicationLogger
import net.rafael.web.control.interfaces.IHandler
import net.rafael.web.control.logging.color.ConsoleColor
import java.lang.Exception

//------------------------------
//
// This class was developed by RafaDev
// On 24.05.2020 at 14:31
// In the project WebControl
//
//------------------------------

class ExceptionHandler(private val logger: ApplicationLogger) : IHandler {

    override fun handle(objects: Array<Any>) {
        val exception = objects[0] as Exception
        ConsoleColor.toColouredString('§', """§cAn Exception has occurred§8: §4${exception.message}""".trimIndent())
            ?.let { logger.error(it) }

        for (stackTraceElement in exception.stackTrace) {
            ConsoleColor.toColouredString('§', """§4${stackTraceElement}""".trimIndent())?.let { logger.error(it) }
        }
    }

}