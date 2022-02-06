package net.rafael.web.control.console.logger

import net.rafael.web.control.console.interfaces.IApplicationLogger
import net.rafael.web.control.console.service.ApplicationConsole
import java.text.SimpleDateFormat
import net.rafael.web.control.console.level.LoggingLevel
import net.rafael.web.control.console.interfaces.IApplicationConsole
import java.util.*

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 3:51 PM
// In the project WebControl
//
//------------------------------

class ApplicationLogger : IApplicationLogger {

    private val loggingService: ApplicationConsole = ApplicationConsole()
    private var dateFormat: SimpleDateFormat
    private var loggingStyle = System.getProperty("web-control.console.style", "§8[§b%time%§8] §7%level% §8» §7%message%")

    private var debugging = false;

    init {
        dateFormat = SimpleDateFormat("dd.MM.yyyy HH:mm:ss")
    }

    override fun info(obj: Any) {
        log(obj, LoggingLevel.INFO)
    }

    override fun warning(obj: Any) {
        log(obj, LoggingLevel.WARNING)
    }

    override fun debug(obj: Any) {
        log(obj, LoggingLevel.DEBUG)
    }

    override fun error(obj: Any) {
        if(obj is Throwable) {
            log("An error occurred while running the program§8: §4" + obj.javaClass.simpleName, LoggingLevel.ERROR)
            for (stackTraceElement in obj.stackTrace) {
                log("   $stackTraceElement", LoggingLevel.ERROR)
            }
        } else {
            log(obj.toString(), LoggingLevel.ERROR)
        }
    }

    override fun log(obj: Any, level: LoggingLevel) {
        if(level == LoggingLevel.DEBUG && !debugging) {
            return
        }
        var text = loggingStyle
        text = text
            .replace("%time%", dateFormat.format(Date()))
            .replace("%level%", "§" + level.levelColor.index + level.levelName)
            .replace("%message%", "§" + level.textColor.index + obj.toString())
        loggingService.writeLine(text)
    }

    override fun enableDebugging() {
        this.debugging = true;
    }

    override fun disableDebugging() {
        this.debugging = false;
    }

    override fun getDebuggingState(): Boolean {
        return this.debugging
    }

    override fun getConsole(): IApplicationConsole {
        return loggingService
    }

    override fun getStyle(): String {
        return loggingStyle
    }

    override fun setStyle(style: String) {
        loggingStyle = style
    }

    override fun getDateFormat(): SimpleDateFormat {
        return dateFormat
    }

    override fun setDateFormat(dateFormat: SimpleDateFormat) {
        this.dateFormat = dateFormat
    }

}