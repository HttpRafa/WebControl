package net.rafael.web.control.console.interfaces

import net.rafael.web.control.console.input.ConsoleThread
import net.rafael.web.control.console.state.ConsoleState
import org.jline.reader.impl.LineReaderImpl
import org.jline.terminal.Terminal

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 3:05 PM
// In the project WebControl
//
//------------------------------

interface IApplicationLoggingService {

    fun writeLine(text: String)
    fun write(text: String)

    fun redisplay()

    fun updatePrompt()
    fun resetPrompt()

    fun clearConsole()

    fun getConsoleState(): ConsoleState
    fun setConsoleState(state: ConsoleState)

    fun getPrompt(): String
    fun getLineReader(): LineReaderImpl
    fun getTerminal(): Terminal
    fun getConsoleThread(): ConsoleThread

}