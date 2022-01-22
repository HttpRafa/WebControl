package net.rafael.web.control.logging

import jline.AnsiWindowsTerminal
import jline.console.ConsoleReader
import java.text.SimpleDateFormat
import net.rafael.web.control.logging.color.ConsoleColor
import net.rafael.web.control.logging.exeption.ExceptionHandler
import java.io.IOException
import java.io.PrintStream
import java.lang.Exception
import java.util.*

//------------------------------
//
// This class was developed by RafaDev
// On 17.05.2020 at 14:23
// In the project WebControl
//
//------------------------------

class ApplicationLogger {

    private var consoleReader: ConsoleReader = ConsoleReader(System.`in`, System.out)
    private val exceptionHandler: ExceptionHandler
    var isDebugging = false

    init {
        consoleReader.expandEvents = false
        consoleReader.prompt = ""
        consoleReader.resetPromptLine("", "", 0)
        exceptionHandler = ExceptionHandler(this)

        info("Logger was loaded.")
    }

    fun handleException(exception: Exception) {
        exceptionHandler.handle(arrayOf(exception))
    }

    fun overrideLine(id: Int, obj: Any) {
        try {
            if (id == 1) {
                val formatter = SimpleDateFormat("dd.MM.yyyy HH:mm:ss")
                val currentTime = Date()
                val format = ConsoleColor.toColouredString('§', "§8") + "[ " + ConsoleColor.toColouredString(
                    '§',
                    "§3"
                ) + formatter.format(currentTime) + ConsoleColor.toColouredString('§', "§8") + " ]"
                consoleReader.print(
                    ConsoleReader.RESET_LINE.toString() + format + ConsoleColor.toColouredString(
                        '§',
                        "§7"
                    ) + " INFO " + ConsoleColor.toColouredString('§', "§8") + "» " + ConsoleColor.toColouredString(
                        '§',
                        "§7"
                    ) + ConsoleColor.toColouredString('§', "$obj§r")
                )
            }
            if (id == 2) {
                val formatter = SimpleDateFormat("dd.MM.yyyy HH:mm:ss")
                val currentTime = Date()
                val format = ConsoleColor.toColouredString('§', "§8") + "[ " + ConsoleColor.toColouredString(
                    '§',
                    "§3"
                ) + formatter.format(currentTime) + ConsoleColor.toColouredString('§', "§8") + " ]"
                consoleReader.print(
                    ConsoleReader.RESET_LINE.toString() + format + ConsoleColor.toColouredString(
                        '§',
                        "§4"
                    ) + " ERROR " + ConsoleColor.toColouredString('§', "§8") + "» " + ConsoleColor.toColouredString(
                        '§',
                        "§c"
                    ) + ConsoleColor.toColouredString('§', "$obj§r")
                )
            }
            //consoleReader.drawLine();
            consoleReader.flush()
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    fun clearConsole() {
        try {
            consoleReader.clearScreen()
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    fun nextLine() {
        try {
            consoleReader.print("\n")
            consoleReader.drawLine()
            consoleReader.flush()
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    fun info(obj: Any) {
        val formatter = SimpleDateFormat("dd.MM.yyyy HH:mm:ss")
        val currentTime = Date()
        val format = ConsoleColor.toColouredString('§', "§8") + "[ " + ConsoleColor.toColouredString(
            '§',
            "§3"
        ) + formatter.format(currentTime) + ConsoleColor.toColouredString('§', "§8") + " ]"
        try {
            consoleReader.print(
                """${ConsoleReader.RESET_LINE}$format${
                    ConsoleColor.toColouredString(
                        '§',
                        "§7"
                    )
                } INFO ${ConsoleColor.toColouredString('§', "§8")}» ${
                    ConsoleColor.toColouredString(
                        '§',
                        "§7"
                    )
                }${ConsoleColor.toColouredString('§', obj.toString())}${ConsoleColor.toColouredString('§', "§r")}
"""
            )
            consoleReader.drawLine()
            consoleReader.flush()
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    fun error(obj: Any) {
        val formatter = SimpleDateFormat("dd.MM.yyyy HH:mm:ss")
        val currentTime = Date()
        val format = ConsoleColor.toColouredString('§', "§8") + "[ " + ConsoleColor.toColouredString(
            '§',
            "§3"
        ) + formatter.format(currentTime) + ConsoleColor.toColouredString('§', "§8") + " ]"
        try {
            consoleReader.print(
                """${ConsoleReader.RESET_LINE}$format${
                    ConsoleColor.toColouredString(
                        '§',
                        "§4"
                    )
                } ERROR ${ConsoleColor.toColouredString('§', "§8")}» ${
                    ConsoleColor.toColouredString(
                        '§',
                        "§c"
                    )
                }${ConsoleColor.toColouredString('§', obj.toString())}${ConsoleColor.toColouredString('§', "§r")}
"""
            )
            consoleReader.drawLine()
            consoleReader.flush()
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    fun warning(obj: Any) {
        val formatter = SimpleDateFormat("dd.MM.yyyy HH:mm:ss")
        val currentTime = Date()
        val format = ConsoleColor.toColouredString('§', "§8") + "[ " + ConsoleColor.toColouredString(
            '§',
            "§3"
        ) + formatter.format(currentTime) + ConsoleColor.toColouredString('§', "§8") + " ]"
        try {
            consoleReader.print(
                """${ConsoleReader.RESET_LINE}$format${
                    ConsoleColor.toColouredString(
                        '§',
                        "§c"
                    )
                } WARNING ${ConsoleColor.toColouredString('§', "§8")}» ${
                    ConsoleColor.toColouredString(
                        '§',
                        "§c"
                    )
                }${ConsoleColor.toColouredString('§', obj.toString())}${ConsoleColor.toColouredString('§', "§r")}
"""
            )
            consoleReader.drawLine()
            consoleReader.flush()
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    fun debug(obj: Any) {
        if (isDebugging) {
            val formatter = SimpleDateFormat("dd.MM.yyyy HH:mm:ss")
            val currentTime = Date()
            val format = ConsoleColor.toColouredString('§', "§8") + "[ " + ConsoleColor.toColouredString(
                '§',
                "§3"
            ) + formatter.format(currentTime) + ConsoleColor.toColouredString('§', "§8") + " ]"
            try {
                consoleReader.print(
                    """${ConsoleReader.RESET_LINE}$format${
                        ConsoleColor.toColouredString(
                            '§',
                            "§b"
                        )
                    } DEBUG ${ConsoleColor.toColouredString('§', "§8")}» ${
                        ConsoleColor.toColouredString(
                            '§',
                            "§7"
                        )
                    }${ConsoleColor.toColouredString('§', obj.toString())}${ConsoleColor.toColouredString('§', "§r")}
"""
                )
                consoleReader.drawLine()
                consoleReader.flush()
            } catch (e: IOException) {
                e.printStackTrace()
            }
        }
    }

    fun readLine(prompt: String?): String? {
        try {
            val line = consoleReader.readLine(prompt)
            consoleReader.prompt = ""
            return line
        } catch (e: IOException) {
            e.printStackTrace()
        }
        return null
    }
}