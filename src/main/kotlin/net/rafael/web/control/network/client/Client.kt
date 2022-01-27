package net.rafael.web.control.network.client

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

}