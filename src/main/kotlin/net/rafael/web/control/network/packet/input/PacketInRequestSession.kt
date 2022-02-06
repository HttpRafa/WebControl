package net.rafael.web.control.network.packet.input

import net.rafael.web.control.WebControl
import net.rafael.web.control.network.client.Client
import net.rafael.web.control.network.packet.IPacketHandler
import net.rafael.web.control.network.packet.Packet
import net.rafael.web.control.network.packet.output.PacketOutRequestSessionAnswer
import java.util.*

//------------------------------
//
// This class was developed by Rafael K.
// On 2/2/2022 at 4:49 PM
// In the project WebControl
//
//------------------------------

class PacketInRequestSession : IPacketHandler {

    override fun handle(client: Client, packet: Packet) {
        val username: String = packet.document.getAsString("username")
        val password: String = packet.document.getAsString("password")

        val user = WebControl.webControl.userManager.get(username)
        if(user.isPresent) {
            if(user.get().password == password) {
                client.sendPacket(PacketOutRequestSessionAnswer(user.get().createSession().session))
            } else {
                client.sendPacket(PacketOutRequestSessionAnswer())
            }
        } else {
            client.sendPacket(PacketOutRequestSessionAnswer())
        }

    }

    override val packetId: Int
        get() = 2

}