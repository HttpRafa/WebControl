package net.rafael.web.control.network.packet

import net.rafael.web.control.network.client.Client

//------------------------------
//
// This class was developed by Rafael K.
// On 2/3/2022 at 4:39 PM
// In the project WebControl
//
//------------------------------

class PacketHandler {

    private val handlers: MutableList<IPacketHandler> = mutableListOf()

    fun register(handler: IPacketHandler) {
        handlers.add(handler)
    }

    fun unregister(handler: IPacketHandler) {
        handlers.remove(handler)
    }

    fun handle(client: Client, packet: Packet) {
        for (handler in handlers) {
            if (handler.packetId == packet.id) {
                handler.handle(client, packet)
            }
        }
    }

}