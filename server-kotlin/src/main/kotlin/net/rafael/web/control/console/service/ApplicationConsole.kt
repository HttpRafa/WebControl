package net.rafael.web.control.console.service

import net.rafael.web.control.console.animation.AbstractConsoleAnimation
import net.rafael.web.control.console.color.ConsoleColor
import net.rafael.web.control.console.input.ConsoleThread
import net.rafael.web.control.console.interfaces.IApplicationConsole
import net.rafael.web.control.console.lib.InternalLineReaderBuilder
import net.rafael.web.control.console.state.ConsoleState
import org.fusesource.jansi.Ansi
import org.jline.reader.LineReader
import org.jline.reader.impl.LineReaderImpl
import org.jline.terminal.Terminal
import org.jline.terminal.TerminalBuilder
import org.jline.utils.InfoCmp
import java.nio.charset.StandardCharsets
import java.util.*
import java.util.concurrent.Executors


//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 3:10 PM
// In the project WebControl
//
//------------------------------

class ApplicationConsole : IApplicationConsole {

    private val runningAnimations: MutableMap<UUID, AbstractConsoleAnimation> = mutableMapOf()

    private val terminal: Terminal = TerminalBuilder.builder()
        .system(true)
        .encoding(StandardCharsets.UTF_8)
        .build()
    private val lineReader: LineReaderImpl

    private val consoleThread = ConsoleThread(this)
    private val animationThreadPool = Executors.newCachedThreadPool()

    private var prompt = System.getProperty("web-control.console.prompt", "§8[ §7%user%§8@§3Web§bControl §8] §7%state% ")
    private var consoleState = ConsoleState.NORMAL
    private var allowWrite = true

    init {
        this.lineReader = InternalLineReaderBuilder(this.terminal)
            .option(LineReader.Option.DISABLE_EVENT_EXPANSION, true)
            .variable(LineReader.BELL_STYLE, "off")
            .build()

        this.updatePrompt()
        this.consoleThread.start()
    }

    override fun writeLine(text: String) {
        var value = ConsoleColor.toColouredString('§', text)
        if (!value.endsWith(System.lineSeparator())) {
            value += System.lineSeparator()
        }
        this.write(Ansi.ansi().eraseLine(Ansi.Erase.ALL).toString() + '\r' + value + Ansi.ansi().reset().toString())

        if (this.runningAnimations.isNotEmpty()) for (animation in this.runningAnimations.values) animation.addToCursor(1)
    }

    override fun writeRaw(text: String) {
        this.write(ConsoleColor.toColouredString('§', text))
    }

    override fun forceWrite(text: String) {
        return this.writeRaw(Ansi.ansi().eraseLine(Ansi.Erase.ALL).toString() + '\r' + text + ConsoleColor.DEFAULT);
    }

    override fun write(text: String) {
        if(!this.allowWrite) {
            return
        }

        this.lineReader.terminal.puts(InfoCmp.Capability.carriage_return)
        this.lineReader.terminal.puts(InfoCmp.Capability.clr_eol)
        this.lineReader.terminal.writer().print(text)
        this.lineReader.terminal.writer().flush()
        this.redisplay()
    }

    override fun clearConsole() {
        this.terminal.puts(InfoCmp.Capability.clear_screen)
        this.terminal.flush()
    }

    override fun redisplay() {
        if (!this.lineReader.isReading) {
            return
        }
        this.lineReader.callWidget(LineReader.REDRAW_LINE)
        this.lineReader.callWidget(LineReader.REDISPLAY)
    }

    override fun startAnimation(animation: AbstractConsoleAnimation) {
        animation.setConsole(this)

        val uuid = UUID.randomUUID()
        this.runningAnimations[uuid] = animation

        this.animationThreadPool.execute {
            animation.run()
            this.runningAnimations.remove(uuid)
        }
    }

    override fun isPlayingAnimation(): Boolean {
        return this.runningAnimations.isNotEmpty()
    }

    override fun updatePrompt() {
        this.prompt = ConsoleColor.toColouredString('§', prompt
                .replace("%user%", USER)
                .replace("%state%", consoleState.character))
        this.lineReader.setPrompt(prompt)
    }

    override fun resetPrompt() {
        this.prompt = System.getProperty("web-control.console.prompt", "§8[ §7%user%§8@§3Web§bControl §8] §7%state% ")
        this.updatePrompt()
    }

    override fun emptyPrompt() {
        this.prompt = ConsoleColor.DEFAULT.ansiCode
        this.updatePrompt()
    }

    override fun removePrompt() {
        this.prompt = null
        this.updatePrompt()
    }

    override fun getLineReader(): LineReaderImpl {
        return this.lineReader
    }

    override fun getTerminal(): Terminal {
        return this.terminal
    }

    override fun getPrompt(): String {
        return this.prompt
    }

    override fun getConsoleState(): ConsoleState {
        return this.consoleState
    }

    override fun setConsoleState(state: ConsoleState) {
        this.consoleState = state
        this.resetPrompt()
    }

    override fun isAllowedWrite(): Boolean {
        return this.allowWrite
    }

    override fun isReadyToClear(): Boolean {
        return this.runningAnimations.isEmpty()
    }

    override fun setWriteAllowed(write: Boolean) {
        this.allowWrite = write
    }

    override fun getRunningAnimations(): Collection<AbstractConsoleAnimation> {
        return this.runningAnimations.values
    }

    override fun getConsoleThread(): ConsoleThread {
        return this.consoleThread
    }

    companion object {
        private val USER = System.getProperty("user.name")
    }

}