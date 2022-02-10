package net.rafael.web.control.network.packet.input

import com.google.gson.JsonArray
import com.google.gson.JsonElement
import net.rafael.web.control.network.client.Client
import net.rafael.web.control.network.document.Document
import net.rafael.web.control.network.packet.IPacketHandler
import net.rafael.web.control.network.packet.Packet
import net.rafael.web.control.network.packet.output.PacketOutCreateAccountAnswer
import net.rafael.web.control.network.packet.output.PacketOutRequestAnswer

//------------------------------
//
// This class was developed by Rafael K.
// On 2/2/2022 at 4:49 PM
// In the project WebControl
//
//------------------------------

class PacketInRequest : IPacketHandler {

    override fun handle(client: Client, packet: Packet) {
        val dataIdsArray: JsonArray = packet.document.getAsElement("dataIds").asJsonArray
        val dataIds = mutableListOf<Int>()
        for (jsonElement in dataIdsArray) {
            dataIds.add(jsonElement.asInt)
        }
        if(dataIds.contains(-1)) {
            client.sendPacket(PacketOutRequestAnswer(packet.id, Document().append("applicationState", 1)))
        } else {
            client.sendPacket(PacketOutRequestAnswer(packet.id, Document()))
        }
    }

    override val packetId: Int
        get() = 5

}