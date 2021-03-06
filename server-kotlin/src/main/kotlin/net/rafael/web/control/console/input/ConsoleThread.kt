package net.rafael.web.control.console.input

import net.rafael.web.control.WebControl
import net.rafael.web.control.console.input.task.ConsoleInputEvent
import net.rafael.web.control.console.input.task.InputHandler
import net.rafael.web.control.console.interfaces.IApplicationConsole
import org.jline.reader.EndOfFileException
import org.jline.reader.UserInterruptException
import kotlin.system.exitProcess


//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 3:31 PM
// In the project WebControl
//
//------------------------------

class ConsoleThread(private val applicationLogger: IApplicationConsole) : Thread() {

    private val currentHandlers: MutableList<InputHandler> = mutableListOf()
    private val currentHandlersToAdd: MutableList<InputHandler> = mutableListOf()

    override fun run() {
        var line: String? = null
        while (!interrupted() && this.readLine().also { line = it } != null) {
            for (animation in this.applicationLogger.getRunningAnimations()) {
                animation.addToCursor(1)
            }

            for (inputHandler in currentHandlersToAdd) {
                currentHandlers.add(inputHandler);
            }
            currentHandlersToAdd.clear();
            currentHandlers.sortBy { it.priority }

            val iterator = currentHandlers.iterator()
            val event = line?.let { ConsoleInputEvent(it) }
            while (iterator.hasNext()) {
                val input = iterator.next()
                event?.reset()
                val callbackResult = event?.let { input.callback.run(it) }
                if (callbackResult?.isRemove == true) iterator.remove()
            }
        }
    }

    fun registerTask(task: InputHandler) {
        currentHandlersToAdd.add(task)
    }

    private fun readLine(): String? {
        try {
            return applicationLogger.getLineReader().readLine(applicationLogger.getPrompt())
        } catch (ignored: EndOfFileException) {
        } catch (exception: UserInterruptException) {
            exitProcess(-1)
        }
        return null
    }

}