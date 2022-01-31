package net.rafael.web.control.network.client

import org.java_websocket.WebSocket
import java.util.ArrayList
import java.util.Optional

//------------------------------
//
// This class was developed by Rafael K.
// On 1/27/2022 at 5:39 PM
// In the project WebControl
//
//------------------------------

class ClientHandler {

    val clients: MutableList<Client> = mutableListOf()

    fun newClient(client: Client) {
        clients.add(client)
    }

    fun removeClient(client: Client) {
        clients.remove(client)
    }

    fun getByConnection(connection: WebSocket): Optional<Client> {
        return clients.stream().filter { item: Client -> item.webSocket == connection }.findAny()
    }

}