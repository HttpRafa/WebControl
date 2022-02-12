package net.rafael.web.control.network.packet.input

import com.google.gson.JsonArray
import com.google.gson.JsonObject
import net.rafael.web.control.network.client.Client
import net.rafael.web.control.network.document.Document
import net.rafael.web.control.network.packet.IPacketHandler
import net.rafael.web.control.network.packet.Packet
import net.rafael.web.control.network.packet.output.PacketOutRequestAnswer
import java.util.*

//------------------------------
//
// This class was developed by Rafael K.
// On 2/2/2022 at 4:49 PM
// In the project WebControl
//
//------------------------------

class PacketInRequest : IPacketHandler {

    var uptime = 0L
    var lastUpdateTime = System.currentTimeMillis()

    var state = 1

    override fun handle(client: Client, packet: Packet) {
        val dataIdsArray: JsonArray = packet.document.getAsElement("dataIds").asJsonArray
        val dataIds = mutableListOf<Int>()
        for (jsonElement in dataIdsArray) {
            dataIds.add(jsonElement.asInt)
        }

        var sendPacket = PacketOutRequestAnswer(packet.id, Document())
        if(dataIds.contains(0)) {
            sendPacket = PacketOutRequestAnswer(packet.id, Document().append("applicationState", state))
        }
        if(dataIds.contains(1)) {
            sendPacket = PacketOutRequestAnswer(packet.id, Document().append("applicationType", "Minecraft Server"))
        }
        if(dataIds.contains(2)) {
            uptime = uptime + System.currentTimeMillis() - lastUpdateTime
            lastUpdateTime = System.currentTimeMillis()
            if(uptime in 60001..79999) {
                state = 2
            }
            if(uptime in 80001..129999) {
                state = 4
            }
            sendPacket = PacketOutRequestAnswer(packet.id, Document().append("applicationUptime", uptime))
        }
        if(dataIds.contains(3)) {
            sendPacket = PacketOutRequestAnswer(packet.id, Document().append("applicationCpuLoad", Random().nextInt(100)))
        }
        if(dataIds.contains(4)) {
            sendPacket = PacketOutRequestAnswer(packet.id, Document().append("applicationMemoryUsage", arrayOf(1250, 5000)))
        }
        if(dataIds.contains(5)) {
            sendPacket = PacketOutRequestAnswer(packet.id, Document().append("applicationDescription", "Test Desc"))
        }
        if(dataIds.contains(6)) {
            val options = JsonArray()
            for(i in 0 until 4*5) {
                val objectData = JsonObject()
                objectData.addProperty("name", "Test $i")
                objectData.addProperty("value", "$i is the value")
                options.add(objectData)
            }

            sendPacket = PacketOutRequestAnswer(packet.id, Document().append("applicationOptions", options))
        }
        sendPacket.uuid = packet.uuid;
        client.sendPacket(sendPacket)
    }

    override val packetId: Int
        get() = 5

}