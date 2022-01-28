package net.rafael.web.control.console.interfaces

import net.rafael.web.control.console.level.LoggingLevel
import java.text.SimpleDateFormat

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 3:49 PM
// In the project WebControl
//
//------------------------------

interface IApplicationLogger {

    fun info(obj: Any)
    fun warning(obj: Any)
    fun debug(obj: Any)
    fun error(obj: Any)

    fun log(obj: Any, level: LoggingLevel)

    fun getDateFormat(): SimpleDateFormat
    fun setDateFormat(dateFormat: SimpleDateFormat)

    fun getStyle(): String
    fun setStyle(style: String)

    fun getService(): IApplicationLoggingService

}