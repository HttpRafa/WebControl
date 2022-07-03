package net.rafael.web.control.network.client

import net.rafael.web.control.WebControl
import net.rafael.web.control.network.packet.Packet
import net.rafael.web.control.user.User
import org.java_websocket.WebSocket

//------------------------------
//
// This class was developed by Rafael K.
// On 1/27/2022 at 5:40 PM
// In the project WebControl
//
//------------------------------

class Client(val webSocket: WebSocket) {

    var user: User? = null

    fun login(user: User) {
        this.user = user
        WebControl.logger.info("Client§8[§b" + webSocket.remoteSocketAddress.address + "§8:§3" + webSocket.remoteSocketAddress.port + "§8] §7is §alogged §7in as §7User§8[§b" + user.username + "§8]")
    }

    fun sendPacket(packet: Packet) {
        WebControl.webControl.networkServer.sendPacket(this, packet)
    }

}