package net.rafael.web.control.network

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import net.rafael.web.control.WebControl
import net.rafael.web.control.console.text.TextHighlighter
import java.net.InetSocketAddress
import org.java_websocket.server.WebSocketServer
import net.rafael.web.control.network.client.ClientHandler
import org.java_websocket.handshake.ClientHandshake
import net.rafael.web.control.network.client.Client
import net.rafael.web.control.network.packet.Packet
import net.rafael.web.control.network.packet.out.PacketOutWelcome
import net.rafael.web.control.user.User
import org.java_websocket.WebSocket
import java.lang.Exception

//------------------------------
//
// This class was developed by Rafael K.
// On 1/27/2022 at 5:35 PM
// In the project WebControl
//
//------------------------------

class NetworkServer(address: InetSocketAddress?) : WebSocketServer(address) {

    private val gson: Gson = GsonBuilder().create()

    private val clientHandler: ClientHandler = ClientHandler()

    override fun onOpen(connection: WebSocket, handshake: ClientHandshake) {
        val client = Client(connection)
        clientHandler.newClient(client)
        WebControl.logger.info("Client §aconnected§8[§b" + connection.remoteSocketAddress.hostName + "§8:§3" + connection.remoteSocketAddress.port + "§8]. §7Waiting for login request§8.")

        client.sendPacket(PacketOutWelcome())
    }

    override fun onClose(connection: WebSocket, code: Int, reason: String, remote: Boolean) {
        val client = clientHandler.getByConnection(connection)
        if (client.isPresent) {
            val user: User? = client.get().user
            clientHandler.removeClient(client.get())
            if (user != null) {
                WebControl.logger.info("Client §cdisconnected§8[§b" + user.username + "§8]")
            }
        }
    }

    override fun onMessage(connection: WebSocket, message: String) {
        WebControl.logger.debug("[Network] PacketIn -> " + TextHighlighter.highlightJson(message))
        val client = clientHandler.getByConnection(connection)
        if (client.isPresent) {
            val user: User? = client.get().user
            if(user != null) {

            }
        }
    }

    override fun onError(connection: WebSocket, exception: Exception) {
        WebControl.logger.error(exception)
    }

    override fun onStart() {
        val port = address.port;
        WebControl.logger.info("§7NetworkServer §astarted §7on the port §b$port§8.")
    }

    fun sendPacket(client: Client, packet: Packet) {
        WebControl.logger.debug("[Network] PacketOut -> " + TextHighlighter.highlightJson(gson.toJson(packet)))
        client.webSocket.send(gson.toJson(packet))
    }

}