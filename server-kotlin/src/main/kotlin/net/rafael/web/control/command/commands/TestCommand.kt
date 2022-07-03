package net.rafael.web.control.command.commands

import net.rafael.web.control.WebControl
import net.rafael.web.control.command.AbstractCommand
import net.rafael.web.control.network.document.Document
import net.rafael.web.control.network.packet.output.PacketOutRequestAnswer

//------------------------------
//
// This class was developed by Rafael K.
// On 1/25/2022 at 5:08 PM
// In the project WebControl
//
//------------------------------

class TestCommand(name: String) : AbstractCommand(name) {

    override fun execute(args: Array<String>) {
        for (client in WebControl.webControl.networkServer.clientHandler.clients) {
            client.sendPacket(PacketOutRequestAnswer(5, Document().append("applicationConsoleMessage", args[0])))
        }
    }

}