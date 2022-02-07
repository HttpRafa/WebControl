package net.rafael.web.control.network.packet.input

import net.rafael.web.control.WebControl
import net.rafael.web.control.network.client.Client
import net.rafael.web.control.network.packet.IPacketHandler
import net.rafael.web.control.network.packet.Packet
import net.rafael.web.control.network.packet.output.PacketOutLoginAnswer

//------------------------------
//
// This class was developed by Rafael K.
// On 2/2/2022 at 4:49 PM
// In the project WebControl
//
//------------------------------

class PacketInLogin : IPacketHandler {

    override fun handle(client: Client, packet: Packet) {
        val username: String = packet.document.getAsString("username")
        val session: String = packet.document.getAsString("session")

        val user = WebControl.webControl.userManager.get(username)
        if(user.isPresent) {
            if(user.get().hasSession(session)) {
                client.login(user.get())
                client.sendPacket(PacketOutLoginAnswer(true))
            } else {
                client.sendPacket(PacketOutLoginAnswer(false))
            }
        } else {
            client.sendPacket(PacketOutLoginAnswer(false))
        }
    }

    override val packetId: Int
        get() = 1

}