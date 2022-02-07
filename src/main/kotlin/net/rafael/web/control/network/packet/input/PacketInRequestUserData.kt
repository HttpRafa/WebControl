package net.rafael.web.control.network.packet.input

import net.rafael.web.control.network.client.Client
import net.rafael.web.control.network.packet.IPacketHandler
import net.rafael.web.control.network.packet.Packet
import net.rafael.web.control.network.packet.output.PacketOutRequestUserData

//------------------------------
//
// This class was developed by Rafael K.
// On 2/2/2022 at 4:49 PM
// In the project WebControl
//
//------------------------------

class PacketInRequestUserData : IPacketHandler {

    override fun handle(client: Client, packet: Packet) {
        client.user?.let { PacketOutRequestUserData(it) }?.let { client.sendPacket(it) }
    }

    override val packetId: Int
        get() = 4

}