package net.rafael.web.control.setup.classes

import net.rafael.web.control.WebControl
import net.rafael.web.control.interfaces.ObjectRunnable
import java.lang.Runnable
import java.util.UUID
import java.util.ArrayList

//------------------------------
//
// This class was developed by Rafael K.
// On 1/26/2022 at 5:28 PM
// In the project WebControl
//
//------------------------------

class ConsoleSetup(finishedCallback: ObjectRunnable<ConsoleSetup, Any>, vararg steps: ConsoleSetupStep) {

    val uuid: UUID
    var step = 0
        private set

    private val finishedCallback: MutableList<ObjectRunnable<ConsoleSetup, Any>> = ArrayList()
    private val steps: MutableList<ConsoleSetupStep> = ArrayList()

    init {
        this.finishedCallback.add(finishedCallback)
        this.steps.addAll(listOf(*steps))
        uuid = UUID.randomUUID()
    }

    fun init() {
        val consoleSetupStep = steps[step]
        consoleSetupStep.question()
    }

    fun nextStep(value: String?):  Boolean {
        var consoleSetupStep = steps[step]
        val result = consoleSetupStep.checkValue(value!!)
        if (result.get() as Boolean) {
            step++
            if (step >= steps.size) {
                for (runnable in finishedCallback) {
                    runnable.run(this)
                }
                return true
            } else {
                consoleSetupStep = steps[step]
                consoleSetupStep.question()
            }
        } else {
            WebControl.logger.error("§c" + result.get(1))
        }
        return false
    }

    fun finishedCallback(callback: ObjectRunnable<ConsoleSetup, Any>) {
        finishedCallback.add(callback)
    }

    fun getSteps(): List<ConsoleSetupStep> {
        return steps
    }

}