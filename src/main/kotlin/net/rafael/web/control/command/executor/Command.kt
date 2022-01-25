package net.rafael.web.control.command.executor

//------------------------------
//
// This class was developed by Rafael K.
// On 1/25/2022 at 5:08 PM
// In the project WebControl
//
//------------------------------

open class Command(val name: String, val usage: String?, val description: String) {

    open fun execute(args: Array<String>) {

    }

}