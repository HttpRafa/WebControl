package net.rafael.web.control.network.packet.input

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
        var username: String = packet.document.getAsString("username")
        var session: String = packet.document.getAsString("session")
        client.sendPacket(PacketOutLoginAnswer(true))
    }

    override val packetId: Int
        get() = 1

}