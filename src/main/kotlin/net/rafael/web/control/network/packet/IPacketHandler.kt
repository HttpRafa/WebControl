package net.rafael.web.control.network.packet

//------------------------------
//
// This class was developed by Rafael K.
// On 1/31/2022 at 10:30 AM
// In the project WebControl
//
//------------------------------
interface IPacketHandler {

    fun handle(packet: Packet)

    val packetId: Int

}