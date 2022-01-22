package net.rafael.web.control.main

import net.rafael.web.control.WebControl
import org.fusesource.jansi.AnsiConsole

//------------------------------
//
// This class was developed by Rafael K.
// On 1/20/2022 at 1:26 PM
// In the project WebControl
//
//------------------------------

fun main(args: Array<String>) {
    println("Starting WebControl Node...")

    AnsiConsole.systemInstall()

    WebControl(args)
}