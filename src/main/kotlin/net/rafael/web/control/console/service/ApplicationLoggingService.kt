package net.rafael.web.control.console.service

import net.rafael.web.control.console.color.ConsoleColor.Companion.toColouredString
import net.rafael.web.control.console.interfaces.IApplicationLoggingService
import net.rafael.web.control.console.input.ConsoleThread
import net.rafael.web.control.console.state.ConsoleState
import net.rafael.web.control.console.lib.InternalLineReaderBuilder
import org.fusesource.jansi.Ansi
import org.jline.reader.LineReader
import org.jline.reader.impl.LineReaderImpl
import org.jline.terminal.Terminal
import org.jline.terminal.TerminalBuilder
import org.jline.utils.InfoCmp
import java.nio.charset.StandardCharsets

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 3:10 PM
// In the project WebControl
//
//------------------------------

class ApplicationLoggingService : IApplicationLoggingService {

    private val terminal: Terminal = TerminalBuilder.builder()
        .system(true)
        .encoding(StandardCharsets.UTF_8)
        .build()
    private val lineReader: LineReaderImpl

    private val consoleThread = ConsoleThread(this)

    private var prompt = System.getProperty("web-control.console.prompt", "§8[ §7%user%§8@§3Web§bControl §8] §7%state% ")
    private var consoleState = ConsoleState.NORMAL

    init {
        lineReader = InternalLineReaderBuilder(terminal)
            .option(LineReader.Option.DISABLE_EVENT_EXPANSION, true)
            .variable(LineReader.BELL_STYLE, "off")
            .build()

        updatePrompt()
        consoleThread.start()
    }

    override fun writeLine(text: String) {
        var value = toColouredString('§', text)
        if (!value.endsWith(System.lineSeparator())) {
            value += System.lineSeparator()
        }
        write(Ansi.ansi().eraseLine(Ansi.Erase.ALL).toString() + '\r' + value + Ansi.ansi().reset().toString())
    }

    override fun write(text: String) {
        lineReader.terminal.puts(InfoCmp.Capability.carriage_return)
        lineReader.terminal.puts(InfoCmp.Capability.clr_eol)
        lineReader.terminal.writer().print(text)
        lineReader.terminal.writer().flush()
        redisplay()
    }

    override fun clearConsole() {
        terminal.puts(InfoCmp.Capability.clear_screen)
        terminal.flush()
    }

    override fun updatePrompt() {
        prompt = toColouredString('§', prompt
                .replace("%user%", USER)
                .replace("%state%", consoleState.character))
        lineReader.setPrompt(prompt)
    }

    override fun resetPrompt() {
        prompt = System.getProperty("web-control.console.prompt", "§8[ §7%user%§8@§3Web§bControl §8] §7%state% ")
        updatePrompt()
    }

    override fun getLineReader(): LineReaderImpl {
        return lineReader
    }

    override fun getTerminal(): Terminal {
        return terminal
    }

    override fun getPrompt(): String {
        return prompt
    }

    override fun redisplay() {
        if (!lineReader.isReading) {
            return
        }
        lineReader.callWidget(LineReader.REDRAW_LINE)
        lineReader.callWidget(LineReader.REDISPLAY)
    }

    override fun getConsoleState(): ConsoleState {
        return consoleState
    }

    override fun setConsoleState(state: ConsoleState) {
        consoleState = state
        resetPrompt()
    }

    override fun getConsoleThread(): ConsoleThread {
        return consoleThread
    }

    companion object {
        private val USER = System.getProperty("user.name")
    }

}