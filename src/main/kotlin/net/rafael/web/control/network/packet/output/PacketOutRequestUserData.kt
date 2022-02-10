package net.rafael.web.control.network.packet.output

import com.google.gson.JsonArray
import net.rafael.web.control.network.document.Document
import net.rafael.web.control.network.packet.Packet
import net.rafael.web.control.user.User

//------------------------------
//
// This class was developed by Rafael K.
// On 2/7/2022 at 8:42 PM
// In the project WebControl
//
//------------------------------

class PacketOutRequestUserData(document: Document) : Packet(4, document) {

    companion object {

        fun create(user: User): PacketOutRequestUserData {
            val document = Document().append("applicationId", 0)
            val applicationList = JsonArray()
            applicationList.add(Document().append("name", "Example").append("id", 0).append("icon", 0).data)
            document.append("applications", applicationList)
            return PacketOutRequestUserData(document)
        }

    }

}
