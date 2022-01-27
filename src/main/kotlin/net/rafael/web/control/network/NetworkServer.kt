package net.rafael.web.control.network

import net.rafael.web.control.WebControl
import java.net.InetSocketAddress
import org.java_websocket.server.WebSocketServer
import net.rafael.web.control.network.client.ClientHandler
import org.java_websocket.handshake.ClientHandshake
import net.rafael.web.control.network.client.Client
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

    private val clientHandler: ClientHandler = ClientHandler()

    override fun onOpen(connection: WebSocket, handshake: ClientHandshake) {
        val client = Client(connection)
        clientHandler.newClient(client)
        WebControl.logger.info("Client §aconnected§8[§b" + connection.remoteSocketAddress.hostName + "§8]. §7Waiting for login request§8.")
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

    }

    override fun onError(connection: WebSocket, ex: Exception) {

    }

    override fun onStart() {
        val port = address.port;
        WebControl.logger.info("§7NetworkServer §astarted §7on the port §b$port§8.")
    }

}