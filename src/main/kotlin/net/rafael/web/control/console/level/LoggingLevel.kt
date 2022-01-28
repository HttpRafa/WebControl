package net.rafael.web.control.console.level

import net.rafael.web.control.console.color.ConsoleColor

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 4:05 PM
// In the project WebControl
//
//------------------------------

enum class LoggingLevel(val levelName: String, val levelColor: ConsoleColor) {

    INFO("INFO", ConsoleColor.GRAY),
    WARNING("WARNING", ConsoleColor.ORANGE),
    DEBUG("DEBUG", ConsoleColor.AQUA),
    ERROR("ERROR", ConsoleColor.RED);

}