package net.rafael.web.control.console.logger

import net.rafael.web.control.console.interfaces.IApplicationLogger
import net.rafael.web.control.console.service.ApplicationLoggingService
import java.text.SimpleDateFormat
import net.rafael.web.control.console.level.LoggingLevel
import net.rafael.web.control.console.interfaces.IApplicationLoggingService
import java.util.*

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 3:51 PM
// In the project WebControl
//
//------------------------------

class ApplicationLogger : IApplicationLogger {

    private val loggingService: ApplicationLoggingService = ApplicationLoggingService()
    private var dateFormat: SimpleDateFormat
    private var loggingStyle = System.getProperty("web-control.console.style", "§8[§b%time%§8] §7%level% §8» §7%message%")

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
        log(obj, LoggingLevel.ERROR)
    }

    override fun log(obj: Any, level: LoggingLevel) {
        var text = loggingStyle
        text = text
            .replace("%time%", dateFormat.format(Date()))
            .replace("%level%", "§" + level.levelColor.index + level.levelName)
            .replace("%message%", obj.toString())
        loggingService.writeLine(text)
    }

    override fun getService(): IApplicationLoggingService {
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