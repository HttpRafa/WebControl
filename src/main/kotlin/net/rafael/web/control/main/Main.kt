package net.rafael.web.control.main

import net.rafael.web.control.WebControl
import net.rafael.web.control.console.color.ConsoleColor
import org.fusesource.jansi.AnsiConsole

//------------------------------
//
// This class was developed by Rafael K.
// On 1/20/2022 at 1:26 PM
// In the project WebControl
//
//------------------------------

fun main(args: Array<String>) {
    System.setProperty("file.encoding", "UTF-8");
    System.setProperty("client.encoding.override", "UTF-8");
    System.setProperty("java.util.logging.SimpleFormatter.format", "[%1\$tF %1\$tT] [%4$-7s] %5\$s %n");

    AnsiConsole.systemInstall()
    showName()

    WebControl(args).start()
}

fun showName() {
    println(
        ConsoleColor.toColouredString('§', "\n \n" +
            "§3▒█░░▒█ █▀▀ █▀▀▄ §b▒█▀▀█ █▀▀█ █▀▀▄ ▀▀█▀▀ █▀▀█ █▀▀█ █░░ \n" +
            "§3▒█▒█▒█ █▀▀ █▀▀▄ §b▒█░░░ █░░█ █░░█ ░░█░░ █▄▄▀ █░░█ █░░ \n" +
            "§3▒█▄▀▄█ ▀▀▀ ▀▀▀░ §b▒█▄▄█ ▀▀▀▀ ▀░░▀ ░░▀░░ ▀░▀▀ ▀▀▀▀ ▀▀▀§r"))
    println(ConsoleColor.toColouredString('§', "§8«§3*§8» §3Web§bControl §7v§8.§70§8.§b1 §7by §3Rafael K.§r"));
    println(" ")
}
