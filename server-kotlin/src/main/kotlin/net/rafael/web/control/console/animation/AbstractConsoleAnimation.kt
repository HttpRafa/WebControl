package net.rafael.web.control.console.animation

import net.rafael.web.control.WebControl
import java.lang.Runnable
import net.rafael.web.control.console.interfaces.IApplicationConsole
import org.jetbrains.annotations.NonNls
import org.fusesource.jansi.Ansi
import java.lang.InterruptedException
import java.util.ArrayList

//------------------------------
//
// This class was developed by Rafael K.
// On 1/29/2022 at 10:33 AM
// In the project WebControl
//
//------------------------------

abstract class AbstractConsoleAnimation : Runnable {

    private val finishHandler: MutableList<Runnable> = ArrayList()

    private var name: String? = null
    private var console: IApplicationConsole? = null

    var updateInterval = 25
    var startTime: Long = 0
        private set
    private var cursorUp = 1
    var isStaticCursor = false

    constructor() {

    }

    constructor(name: String) {
        this.name = name
    }

    fun getName(): String? {
        return name
    }

    val timeElapsed: Long
        get() = System.currentTimeMillis() - startTime

    fun getConsole(): IApplicationConsole {
        return console!!
    }

    fun setConsole(console: IApplicationConsole) {
        check(this.console == null) { "Cannot set console twice" }
        this.console = console
    }

    fun addToCursor(cursor: Int) {
        if (!isStaticCursor) {
            cursorUp += cursor
        }
    }

    fun setCursor(cursor: Int) {
        cursorUp = cursor
    }

    fun getCursor(): Int {
        return this.cursorUp
    }

    fun addFinishHandler(finishHandler: Runnable) {
        this.finishHandler.add(finishHandler)
    }

    protected fun print(@NonNls vararg input: String?) {
        if (input.isEmpty()) {
            return
        }
        val ansi = Ansi.ansi().saveCursorPosition().cursorUp(cursorUp).eraseLine(Ansi.Erase.ALL)
        for (a in input) {
            ansi.a(a)
        }
        console!!.forceWrite(ansi.restoreCursorPosition().toString())
    }

    protected fun eraseLastLine() {
        console!!.writeRaw(Ansi.ansi().reset().cursorUp(1).eraseLine().toString())
    }

    /**
     * @return Returns of animation should be cancelled
     */
    protected abstract fun handleTick(): Boolean

    override fun run() {
        startTime = System.currentTimeMillis()
        while (!Thread.interrupted() && !handleTick()) {
            try {
                Thread.sleep(updateInterval.toLong())
            } catch (exception: InterruptedException) {
                exception.printStackTrace()
            }
        }
        for (runnable in finishHandler) {
            runnable.run()
        }
    }

}