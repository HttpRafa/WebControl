package net.rafael.web.control.setup.classes

import net.rafael.web.control.WebControl
import net.rafael.web.control.interfaces.ObjectRunnable
import net.rafael.web.control.classes.MethodResult

//------------------------------
//
// This class was developed by Rafael K.
// On 1/26/2022 at 5:30 PM
// In the project WebControl
//
//------------------------------

class ConsoleSetupStep(private val question: String, private val checkValue: ObjectRunnable<String, MethodResult<Any>>) {

    var value: Any? = null
        private set

    fun checkValue(obj: String): MethodResult<Any> {
        val result = checkValue.run(obj)
        return if (result.isPresent) {
            value = result.get(1)
            MethodResult<Any>().of(result.get(), result.get(2))
        } else {
            MethodResult<Any>().of(false, "Step error please restart the application")
        }
    }

    fun question() {
        WebControl.logger.info(question)
    }

}