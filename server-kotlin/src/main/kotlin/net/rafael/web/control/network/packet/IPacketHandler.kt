package net.rafael.web.control.network.packet

import net.rafael.web.control.network.client.Client

//------------------------------
//
// This class was developed by Rafael K.
// On 1/31/2022 at 10:30 AM
// In the project WebControl
//
//------------------------------
interface IPacketHandler {

    fun handle(client: Client, packet: Packet)

    val packetId: Int

}