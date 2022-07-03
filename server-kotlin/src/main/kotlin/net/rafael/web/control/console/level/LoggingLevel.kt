package net.rafael.web.control.console.level

import net.rafael.web.control.console.color.ConsoleColor

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 4:05 PM
// In the project WebControl
//
//------------------------------

enum class LoggingLevel(val levelName: String, val levelColor: ConsoleColor, val textColor: ConsoleColor) {

    INFO("INFO", ConsoleColor.GRAY, ConsoleColor.GRAY),
    WARNING("WARNING", ConsoleColor.ORANGE, ConsoleColor.GRAY),
    DEBUG("DEBUG", ConsoleColor.AQUA, ConsoleColor.GRAY),
    ERROR("ERROR", ConsoleColor.DARK_RED, ConsoleColor.RED);

}