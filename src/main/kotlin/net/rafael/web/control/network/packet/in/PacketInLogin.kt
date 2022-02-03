package net.rafael.web.control.network.packet.`in`

import net.rafael.web.control.network.packet.IPacketHandler
import net.rafael.web.control.network.packet.Packet

//------------------------------
//
// This class was developed by Rafael K.
// On 2/2/2022 at 4:49 PM
// In the project WebControl
//
//------------------------------

class PacketInLogin : IPacketHandler {

    override fun handle(packet: Packet) {

    }

    override val packetId: Int
        get() = 1

}